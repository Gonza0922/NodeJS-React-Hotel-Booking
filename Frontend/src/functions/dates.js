export const resetDate = (date) => {
  //transform the date to "weekDay month day year"
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

// export const transformDateZ = (dateZ) => {
//   //transform the date to "yyyy-mm-dd"
//   const date = new Date(dateZ);
//   const year = date.getUTCFullYear();
//   const month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Add 1 because months in JavaScript go from 0 to 11
//   const day = ("0" + date.getUTCDate()).slice(-2);
//   const ResetedDate = year + "-" + month + "-" + day;

//   return ResetedDate;
//   // Despues de las 9pm el dia pasa a ser el siguiente
// };

export const transformDateZ = (dateZ) => {
  const date = new Date(dateZ);
  const isoDate = date.toISOString().split("T")[0]; // Obtener la fecha en formato ISO (UTC) y recortar la hora y la zona horaria
  return isoDate;
};
