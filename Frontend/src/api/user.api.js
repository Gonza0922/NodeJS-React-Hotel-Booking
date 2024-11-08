import axios from "./axios.js";

export const getAllUsersRequest = async (limit, page) => {
  //Select all users
  const request = await axios.get("/user/all", {
    params: {
      limit: limit,
      page: page,
    },
  });
  return request.data;
};

export const getUserIdRequest = async (user_ID) => {
  //Select the user that matches the user_ID sent by parameter
  const request = await axios.get(`/user/get/${user_ID}`);
  return request.data;
}; //[USED]

export const putUserIdRequest = async (newData) => {
  //Update a user
  const request = await axios.put("/user/update", newData);
  return request.data;
}; //[USED]

export const putUserIdPasswordRequest = async (user_ID, newData) => {
  //Update a user's password
  const request = await axios.put(`/user/password/update/${user_ID}`, newData);
  return request.data;
}; //[USED]

export const registerUserRequest = async (user) => {
  //Register a new user
  const request = await axios.post("/auth/users/register", user);
  return request.data;
}; //[USED]

export const loginUserRequest = async (user) => {
  //Log in a user that matches the data sent
  const request = await axios.post("/auth/users/login", user);
  return request.data;
}; //[USED]

export const logoutUserRequest = async () => {
  //Log out a partner
  const request = await axios.post("/auth/users/logout");
  return request.data;
}; //[USED]

export const verifyTokenUserRequest = async () => {
  //Check if the UserToken exists/matches to enter the user account
  const request = await axios.get("/auth/users/verify");
  return request.data;
}; //[USED]

export const deleteUserRequest = async (user_ID) => {
  //Delete a user that matches the user_ID sent by parameter and all its reservations
  const request = await axios.delete(`/user/delete/${user_ID}`);
  return request.data;
}; //[USED]
