import axios from "./axios.js";

export const getAllCommentsRequest = async (limit, page) => {
  //Select all comments
  const request = await axios.get("/user/all/comments", {
    params: {
      limit: limit,
      page: page,
    },
  });
  return request.data;
};

export const getCommentIdRequest = async (comment_ID) => {
  //Select the comment that matches the comment_ID sent by parameter
  const request = await axios.get(`/user/comments/${comment_ID}`);
  return request.data;
}; //[USED]

export const getCommentPerHotelRequest = async (hotel_ID) => {
  //Select the comment(s) created by the hotel_ID sent by parameter
  const request = await axios.get(`/user/per_hotel/${hotel_ID}`);
  return request.data;
}; //[USED]

export const getCommentPerUserRequest = async (user_ID) => {
  //Select the comment(s) created by the user_ID sent by parameter
  const request = await axios.get(`/user/per_user/${user_ID}`);
  return request.data;
}; //[USED]

export const postCommentRequest = async (dataComment) => {
  //Create a comment
  const request = await axios.post("/user/create/comments", dataComment);
  return request.data;
}; //[USED]

export const putCommentRequest = async (comment_ID, newDataComment) => {
  //Update a comment that matches the comment_ID sent by parameter
  const request = await axios.put(`/user/update/comments/${comment_ID}`, newDataComment);
  return request.data;
}; //[USED]

export const deleteCommentRequest = async (comment_ID) => {
  //Delete a comment that matches the comment_ID sent by parameter
  const request = await axios.delete(`/user/delete/comments/${comment_ID}`);
  return request.data;
}; //[USED]

export const verifyPINRequest = async (hotel_ID, dataReservation) => {
  //Check if the PIN exists in the database and create a cookie
  const request = await axios.post(`/user/verify/PIN/comments/${hotel_ID}`, dataReservation);
  return request.data;
}; //[USED]

export const verifyTokenPINRequest = async (hotel_ID) => {
  //Check if the TokenPIN exists/matches to be able to write a review
  const request = await axios.get(`/user/verify/token/PIN/${hotel_ID}`);
  return request.data;
}; //[USED]
