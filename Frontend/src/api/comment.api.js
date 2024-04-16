import axios from "./axios.js";

export const getAllCommentsRequest = async () => {
  //Selecciona todos los hoteles
  const request = await axios.get("/user/all/comments");
  return request.data;
}; //[SE USA]

export const getCommentIdRequest = async (comment_ID) => {
  //Selecciona el hotel que coincida con el hotel_ID enviado por parametro
  const request = await axios.get(`/user/comments/${comment_ID}`);
  return request.data;
}; //[SE USA]

export const getCommentPerHotelRequest = async (hotel_ID) => {
  //Selecciona el/los hoteles creados por el partner_ID, seleccionado al validar el PartnerToken
  const request = await axios.get(`/user/per_hotel/${hotel_ID}`);
  return request.data;
}; //[SE USA]

export const postCommentRequest = async (dataComment) => {
  //Crea un hotel
  const request = await axios.post("/user/create/comments", dataComment);
  return request.data;
}; //[SE USA]

export const putCommentRequest = async (comment_ID, newDataComment) => {
  //Actualiza un hotel que coincida con el hotel_ID enviado por parametro
  const request = await axios.put(
    `/user/update/comments/${comment_ID}`,
    newDataComment
  );
  return request.data;
}; //[SE USA]

export const deleteCommentRequest = async (comment_ID) => {
  //Elimina un hotel que coincida con el hotel_ID enviado
  const request = await axios.delete(`/user/delete/comments/${comment_ID}`);
  return request.data;
}; //[SE USA]

export const verifyPINRequest = async (hotel_ID, dataReservation) => {
  //Verifica el PIN de la base de datos y crea una cookie
  const request = await axios.post(
    `/user/verify/PIN/comments/${hotel_ID}`,
    dataReservation
  );
  return request.data;
}; //[SE USA]

export const verifyTokenPINRequest = async (hotel_ID) => {
  //Verifica el PIN en la cookie
  const request = await axios.get(`/user/verify/token/PIN/${hotel_ID}`);
  return request.data;
}; //[SE USA]
