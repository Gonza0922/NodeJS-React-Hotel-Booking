export const ResetDate = (date) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
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

  const objDate = new Date(date);

  const weekDay = weekDays[objDate.getUTCDay()];
  const month = months[objDate.getUTCMonth()];
  let day = objDate.getUTCDate();
  const year = objDate.getUTCFullYear();
  let hour = objDate.getUTCHours();

  let subtracted = hour - 3;
  if (subtracted < 0) {
    subtracted += 24;
    day -= 1;
  }

  return `${weekDay} ${month} ${day} ${year}`;
};

export const transformDateZ = (dateZ) => {
  const date = new Date(dateZ);

  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Sumar 1 porque los meses en JavaScript van de 0 a 11
  const day = ("0" + date.getUTCDate()).slice(-2);

  const ResetedDate = year + "-" + month + "-" + day;

  return ResetedDate;
};
