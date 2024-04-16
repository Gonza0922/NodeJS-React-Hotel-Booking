import axios from "./axios.js";

export const getReservationRequest = async () => {
  //Selecciona la reservacion que coincida con el user_ID, seleccionado al validar el UserToken
  const request = await axios.get("/user/per_user/reservations");
  return request.data;
}; //[SE USA]

export const getReservationIdRequest = async (reservation_ID) => {
  //Selecciona la reservacion que coincida con el reservation_ID enviado por parametro
  const request = await axios.get(`/user/reservations/${reservation_ID}`);
  return request.data;
}; //[SE USA]

export const getReservationFromHotelRequest = async (hotel_ID) => {
  //Selecciona la reservacion que coincida con el hotel_ID enviado por parametro
  const request = await axios.get(`/user/hotel/reservations/${hotel_ID}`);
  return request.data;
}; //[SE USA]

export const postReservationRequest = async (reservation) => {
  //Crea una reservacion
  const request = await axios.post("/user/create/reservations", reservation);
  return request.data;
}; //[SE USA]

export const putReservationRequest = async (reservation_ID, newReservation) => {
  //Actualiza un reservacion que coincida con el reservation_ID enviado por parametro
  const request = await axios.put(
    `/user/update/reservations/${reservation_ID}`,
    newReservation
  );
  return request.data;
}; //[SE USA]

export const deleteReservationRequest = async (reservation_ID) => {
  //Elimina un reservacion que coincida con el reservation_ID enviado por parametro
  const request = await axios.delete(
    `/user/delete/reservations/${reservation_ID}`
  );
  return request.data;
}; //[SE USA]
