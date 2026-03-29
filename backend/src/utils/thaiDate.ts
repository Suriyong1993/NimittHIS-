import { format } from "date-fns"
import { th } from "date-fns/locale"

export const formatThaiDate = (value: Date): string => {
  const buddhistYear = value.getFullYear() + 543
  return `${format(value, "d MMMM", { locale: th })} ${buddhistYear}`
}

export const formatThaiDateTime = (value: Date): string => {
  const buddhistYear = value.getFullYear() + 543
  return `${format(value, "d MMM yyyy HH:mm", { locale: th }).replace(
    value.getFullYear().toString(),
    buddhistYear.toString()
  )} น.`
}
