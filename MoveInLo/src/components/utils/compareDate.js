export default function compareDate(d1, d2) {
  // d1 is the current date & d2 is the chosen date
  if (d1 == null || d2 == null) {
    return 3;
  }

  if (d1.getFullYear() > d2.getFullYear()) {
    return 0; // error
  } else if (d1.getFullYear() < d2.getFullYear()) {
    return 1; // ok
  } else {
    if (d1.getMonth() > d2.getMonth()) {
      return 0;
    } else if (d1.getMonth() < d2.getMonth()) {
      return 1;
    } else {
      if (d1.getDate() > d2.getDate()) {
        return 0;
      } else if (d1.getDate() < d2.getDate()) {
        return 1;
      } else {
        return 2;
      }
    }
  }
}
