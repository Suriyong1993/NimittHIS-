import { PatientProfilePage } from "@/views/PatientProfilePage"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PatientProfileRoute({ params }: Props) {
  const { id } = await params
  return <PatientProfilePage patientId={id} />
}
