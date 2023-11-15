export default function DateFormat(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Create an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the date in the desired format
  return `${day} ${monthNames[month]} ${year}`;
}
