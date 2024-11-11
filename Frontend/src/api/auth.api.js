import axios from "./axios.js";

export const registerRequest = async (user) => {
  //Register a new user/partner
  const request = await axios.post("/auth/register", user);
  return request.data;
}; //[USED]

export const loginRequest = async (user) => {
  //Log in a user/partner that matches the data sent
  const request = await axios.post("/auth/login", user);
  return request.data;
}; //[USED]

export const logoutRequest = async (role) => {
  //Log out a user/partner
  const request = await axios.post("/auth/logout", role);
  return request.data;
}; //[USED]

export const verifyTokenUserRequest = async () => {
  //Check if the UserToken/PartnerToken exists/matches to enter the user/partner account
  const request = await axios.get("/auth/users/verify");
  return request.data;
}; //[USED]

export const verifyTokenPartnerRequest = async () => {
  //Check if the UserToken/PartnerToken exists/matches to enter the user/partner account
  const request = await axios.get("/auth/partners/verify");
  return request.data;
}; //[USED]
