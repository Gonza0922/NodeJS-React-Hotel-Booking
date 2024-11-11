import axios from "./axios.js";

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
