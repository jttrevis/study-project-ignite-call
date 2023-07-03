export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('us-GB', { weekday: 'long'})


  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(202, 5, day))))
}