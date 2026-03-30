-- No-Show Automation Flow (MindCare Official)

-- 1. ฟังก์ชันคำนวณคะแนน No-Show ใหม่ (พร้อม Bonus)
CREATE OR REPLACE FUNCTION public.recalculate_no_show_score(p_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_appts INT;
    v_no_shows INT;
    v_score INT;
    v_risk risk_level;
    v_has_high_diagnosis BOOLEAN;
    v_is_recent_noshow BOOLEAN;
BEGIN
    -- ดึงจำนวนครั้งการนัดหมาย
    SELECT COUNT(*) INTO v_total_appts FROM public.appointments WHERE patient_id = p_id;
    SELECT COUNT(*) INTO v_no_shows FROM public.appointments WHERE patient_id = p_id AND status = 'NO_SHOW';

    IF v_total_appts = 0 THEN
        v_score := 0;
    ELSE
        -- ฐานคะแนน: (จำนวนขาดนัด / นัดทั้งหมด) * 100
        v_score := (v_no_shows::FLOAT / v_total_appts::FLOAT) * 100;
    END IF;

    -- Severity Bonus: ถ้ามีการวินิจฉัยโรคความเสี่ยงสูง (เช่น Major Depressive Disorder)
    SELECT EXISTS (
        SELECT 1 FROM public.diagnoses 
        WHERE patient_id = p_id AND (name LIKE '%Depression%' OR name LIKE '%ซึมเศร้า%' OR severity = 'HIGH')
    ) INTO v_has_high_diagnosis;

    IF v_has_high_diagnosis THEN
        v_score := v_score + 10;
    END IF;

    -- Recency Bonus: ขาดนัดล่าสุด (ภายใน 30 วัน)
    SELECT EXISTS (
        SELECT 1 FROM public.appointments 
        WHERE patient_id = p_id AND status = 'NO_SHOW' AND scheduled_at > (NOW() - INTERVAL '30 days')
    ) INTO v_is_recent_noshow;

    IF v_is_recent_noshow THEN
        v_score := v_score + 15;
    END IF;

    -- คุ้มครองไม่ให้คะแนนเกิน 100
    IF v_score > 100 THEN v_score := 100; END IF;

    -- ตัดสินระดับความเสี่ยง (Risk Level)
    IF v_score >= 81 THEN
        v_risk := 'CRITICAL';
    ELSIF v_score >= 61 THEN
        v_risk := 'HIGH';
    ELSIF v_score >= 31 THEN
        v_risk := 'MEDIUM';
    ELSE
        v_risk := 'LOW';
    END IF;

    -- อัปเดตในตาราง patients
    UPDATE public.patients
    SET no_show_score = v_score,
        risk_level = v_risk,
        updated_at = NOW()
    where id = p_id;

    -- บันทึกประวัติคะแนน
    INSERT INTO public.risk_score_history (patient_id, score, factors)
    VALUES (p_id, v_score, jsonb_build_object(
        'no_show_count', v_no_shows,
        'has_high_diagnosis', v_has_high_diagnosis,
        'is_recent_noshow', v_is_recent_noshow,
        'risk_level', v_risk
    ));
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger เมื่อสถานะเป็น NO_SHOW (Risk Escalation Logic)
CREATE OR REPLACE FUNCTION public.on_appointment_no_show_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_patient_name TEXT;
    v_risk risk_level;
    v_consecutive_no_shows INT;
    v_clinic_phone TEXT := '02-xxx-xxxx'; -- เบอร์คลินิก
BEGIN
    IF (NEW.status = 'NO_SHOW' AND (OLD.status IS NULL OR OLD.status != 'NO_SHOW')) THEN
        
        -- ดึงข้อมูลผู้ป่วย
        SELECT first_name || ' ' || last_name, risk_level INTO v_patient_name, v_risk 
        FROM public.patients WHERE id = NEW.patient_id;

        -- 1. คำนวณคะแนนและ Risk Level ใหม่
        PERFORM public.recalculate_no_show_score(NEW.patient_id);
        
        -- อัปเดตข้อมูลระดับความเสี่ยงล่าสุดหลังคำนวณ
        SELECT risk_level INTO v_risk FROM public.patients WHERE id = NEW.patient_id;

        -- 2. เช็คการขาดนัดต่อเนื่อง (Consecutive)
        WITH last_appts AS (
            SELECT status FROM public.appointments 
            WHERE patient_id = NEW.patient_id AND id != NEW.id
            ORDER BY scheduled_at DESC
            LIMIT 2
        )
        SELECT COUNT(*) INTO v_consecutive_no_shows FROM last_appts WHERE status = 'NO_SHOW';
        v_consecutive_no_shows := v_consecutive_no_shows + 1;

        -- 3. ESCALATION RULES
        IF v_consecutive_no_shows >= 3 AND v_risk = 'CRITICAL' THEN
            -- 🚨 CRITICAL ESCALATION: ติดต่อญาติ + Protocol ฉุกเฉิน
            INSERT INTO public.notifications (patient_id, type, channel, title, body)
            values (NEW.patient_id, 'FOLLOWUP', 'PUSH', '🚨 EMERGENCY: Critical Patient No-Show', 
                    'ผู้ป่วย ' || v_patient_name || ' ขาดนัดต่อเนื่อง 3 ครั้ง (สถานะ CRITICAL) โปรดเริ่ม Protocol ติดต่อญาติทันที');
            
            -- สร้างงานติดตามฉุกเฉิน
            INSERT INTO public.followup_actions (appointment_id, patient_id, type, notes)
            VALUES (NEW.id, NEW.patient_id, 'EMERGENCY', 'ดำเนินการติดต่อญาติอัตโนมัติเนื่องจากภาวะวิกฤต');

        ELSIF v_consecutive_no_shows >= 2 THEN
            -- 🌹 Rose Alert: โทรหา + แจ้งหัวหน้า
            INSERT INTO public.notifications (patient_id, type, channel, title, body)
            values (NEW.patient_id, 'FOLLOWUP', 'PUSH', 'แจ้งเตือน: ขาดนัดต่อเนื่อง (ครั้งที่ 2)', 
                    'ผู้ป่วย ' || v_patient_name || ' ขาดนัดเป็นครั้งที่ 2 โปรดโทรติดตามและแจ้งหัวหน้าทีม');
            
            INSERT INTO public.followup_actions (appointment_id, patient_id, type, notes)
            VALUES (NEW.id, NEW.patient_id, 'PHONE_CALL', 'รอการโทรติดตามจากพนักงาน');

        ELSE
            -- 🔸 Amber Alert: SMS อัตโนมัติ (ครั้งแรก)
            INSERT INTO public.notifications (patient_id, type, channel, title, body)
            values (NEW.patient_id, 'NO_SHOW', 'SMS', 'แจ้งเตือนการนัดหมาย', 
                    'สวัสดีคุณ ' || v_patient_name || ' เราสังเกตว่าท่านไม่ได้มาตามนัด หากต้องการนัดใหม่โปรดติดต่อ ' || v_clinic_phone);
            
            INSERT INTO public.followup_actions (appointment_id, patient_id, type, notes)
            VALUES (NEW.id, NEW.patient_id, 'SMS', 'ส่ง SMS แจ้งเตือนอัตโนมัติเรียบร้อย');
        END IF;

    END IF;
    return NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_appointment_no_show ON public.appointments;
CREATE TRIGGER tr_appointment_no_show
AFTER UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.on_appointment_no_show_trigger();

-- 3. Scheduled Job Function: ปรับ No-Show อัตโนมัติ (เลยเวลา 30 นาที)
CREATE OR REPLACE FUNCTION public.check_overdue_appointments()
RETURNS VOID AS $$
BEGIN
    UPDATE public.appointments
    SET status = 'NO_SHOW',
        updated_at = NOW()
    WHERE status = 'SCHEDULED'
      AND scheduled_at < (NOW() - INTERVAL '30 minutes');
END;
$$ LANGUAGE plpgsql;
