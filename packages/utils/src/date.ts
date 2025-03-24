export function formatDateToString(date: Date): String {
    return `${date.getFullYear()}-${getTwoDigitValue(1+date.getUTCMonth())}-${getTwoDigitValue(date.getDate())}`
}  


function getTwoDigitValue(value: number): string {
    return value < 10 ? `0${value}` : `${value}`
}
