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

export const postCommentRequest = async (comment) => {
  //Crea un hotel
  const request = await axios.post("/user/create/comments", comment);
  return request.data;
}; //[SE USA]

export const putCommentRequest = async (comment_ID, newComment) => {
  //Actualiza un hotel que coincida con el hotel_ID enviado por parametro
  const request = await axios.put(
    `/user/update/comments/${comment_ID}`,
    newComment
  );
  return request.data;
}; //[SE USA]

export const deleteCommentRequest = async (comment_ID) => {
  //Elimina un hotel que coincida con el hotel_ID enviado
  const request = await axios.delete(`/user/delete/comments/${comment_ID}`);
  return request.data;
}; //[SE USA]
