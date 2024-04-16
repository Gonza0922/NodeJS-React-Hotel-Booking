import axios from "./axios.js";

export const getPartnerIdRequest = async (partner_ID) => {
  //Select the partner that matches the partner_ID sent by parameter
  const request = await axios.get(`/auth/partners/get/${partner_ID}`);
  return request.data;
}; //[USED]

export const putPartnerIdRequest = async (newData) => {
  //Update a partner
  const request = await axios.put("/auth/partners/update", newData);
  return request.data;
}; //[USED]

export const putPartnerIdPasswordRequest = async (partner_ID, newData) => {
  //Update a partner's password
  const request = await axios.put(
    `/auth/partners/password/update/${partner_ID}`,
    newData
  );
  return request.data;
}; //[USED]

export const registerPartnerRequest = async (partner) => {
  //Register a new partner
  const request = await axios.post("/auth/partners/register", partner);
  return request.data;
}; //[USED]

export const loginPartnerRequest = async (partner) => {
  //Log in a partner that matches the data sent
  const request = await axios.post("/auth/partners/login", partner);
  return request.data;
}; //[USED]

export const logoutPartnerRequest = async () => {
  //Log out a partner
  const request = await axios.post("/auth/partners/logout");
  return request.data;
}; //[USED]

export const verifyTokenPartnerRequest = async () => {
  //Check if the PartnerToken exists/matches to enter the partner account
  const request = await axios.get("/auth/partners/verify");
  return request.data;
}; //[USED]

export const deletePartnerRequest = async (partner_ID) => {
  //Delete a partner that matches the partner_ID sent by parameter, all its hotels and all its reservations
  const request = await axios.delete(`/auth/delete/partners/${partner_ID}`);
  return request.data;
}; //[USED]
