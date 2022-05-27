// Convert time to `4 minutes ago`, `2 years ago`, and so on
const printTime = (num, time) => {
  return `${num} ${num === 1 ? time : `${time}s`} ago`
}

const timeSince = (date) => {
  let secondsDate = new Date(date) - 1000;
  let seconds = Math.floor((new Date() - secondsDate) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "year");
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "month");
  }

  interval = seconds / 86400;
  if (interval > 1) {
    let num = Math.floor(interval);
    if (num === 1) return "Yesterday";
    return num + " days ago";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "hour");
  }

  interval = seconds / 60;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "minute");
  }

  let num = Math.floor(seconds);
  return printTime(num, "second");
}

export default timeSince;