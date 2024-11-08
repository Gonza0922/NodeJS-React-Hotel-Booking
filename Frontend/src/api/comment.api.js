import axios from "./axios.js";

export const getAllCommentsRequest = async (limit, page) => {
  //Select all comments
  const request = await axios.get("/comments/all", {
    params: {
      limit: limit,
      page: page,
    },
  });
  return request.data;
};

export const getCommentIdRequest = async (comment_ID) => {
  //Select the comment that matches the comment_ID sent by parameter
  const request = await axios.get(`/comments/by_comment/${comment_ID}`);
  return request.data;
}; //[USED]

export const getCommentByHotelRequest = async (hotel_ID) => {
  //Select the comment(s) created by the hotel_ID sent by parameter
  const request = await axios.get(`/comments/by_hotel/${hotel_ID}`);
  return request.data;
}; //[USED]

export const getCommentByUserRequest = async (user_ID) => {
  //Select the comment(s) created by the user_ID sent by parameter
  const request = await axios.get(`/comments/by_user/${user_ID}`);
  return request.data;
}; //[USED]

export const postCommentRequest = async (dataComment) => {
  //Create a comment
  const request = await axios.post("/comments/create", dataComment);
  return request.data;
}; //[USED]

export const putCommentRequest = async (comment_ID, newDataComment) => {
  //Update a comment that matches the comment_ID sent by parameter
  const request = await axios.put(`/comments/update/${comment_ID}`, newDataComment);
  return request.data;
}; //[USED]

export const deleteCommentRequest = async (comment_ID) => {
  //Delete a comment that matches the comment_ID sent by parameter
  const request = await axios.delete(`/comments/delete/${comment_ID}`);
  return request.data;
}; //[USED]

export const verifyPINRequest = async (hotel_ID, dataReservation) => {
  //Check if the PIN exists in the database and create a cookie
  const request = await axios.post(`/comments/verify/PIN/${hotel_ID}`, dataReservation);
  return request.data;
}; //[USED]

export const verifyTokenPINRequest = async (hotel_ID) => {
  //Check if the TokenPIN exists/matches to be able to write a review
  const request = await axios.get(`/comments/verify/token/PIN/${hotel_ID}`);
  return request.data;
}; //[USED]
