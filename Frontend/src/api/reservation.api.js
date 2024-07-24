import axios from "./axios.js";

export const getReservationRequest = async () => {
  //Select the reservation that matches the user_ID, selected when validating the UserToken
  const request = await axios.get("/user/per_user/reservations");
  return request.data;
}; //[USED]

export const getReservationIdRequest = async (reservation_ID) => {
  //Select the reservation that matches the reservation_ID sent by parameter
  const request = await axios.get(`/user/reservations/${reservation_ID}`);
  return request.data;
}; //[USED]

export const getReservationFromHotelRequest = async (hotel_ID) => {
  //Select the reservation that matches the hotel_ID sent by parameter
  const request = await axios.get(`/user/hotel/reservations/${hotel_ID}`);
  return request.data;
}; //[USED]

export const postReservationRequest = async (reservation) => {
  //Create a reservation
  const request = await axios.post("/user/create/reservations", reservation);
  return request.data;
}; //[USED]

export const putReservationRequest = async (reservation_ID, newReservation) => {
  //Update reservation
  const request = await axios.put(`/user/update/reservations/${reservation_ID}`, newReservation);
  return request.data;
}; //[USED]

export const deleteReservationRequest = async (reservation_ID) => {
  //Delete a reservation
  const request = await axios.delete(`/user/delete/reservations/${reservation_ID}`);
  return request.data;
}; //[USED]
