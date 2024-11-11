import axios from "./axios.js";

export const registerRequest = async (user) => {
  //Register a new user/partner
  const request = await axios.post("/auth/users/register", user);
  return request.data;
}; //[USED]

export const loginRequest = async (user) => {
  //Log in a user/partner that matches the data sent
  const request = await axios.post("/auth/users/login", user);
  return request.data;
}; //[USED]

export const logoutRequest = async (role) => {
  //Log out a user/partner
  const request = await axios.post("/auth/users/logout", role);
  return request.data;
}; //[USED]

export const verifyTokenRequest = async () => {
  //Check if the UserToken/PartnerToken exists/matches to enter the user/partner account
  const request = await axios.get("/auth/users/verify");
  return request.data;
}; //[USED]
