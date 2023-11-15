export default function TimeFormat(time) {
  const hours = time.getHours() % 12 || 12;
  const hourString = hours < 10 ? "0" + hours.toString() : hours.toString();
  const minutes = time.getMinutes();
  const minuteString =
    minutes < 10 ? "0" + minutes.toString() : minutes.toString();
  const marker = time.getHours() >= 12 ? "PM" : "AM";
  return `${hourString}:${minuteString} ${marker}`;
}
