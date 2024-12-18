import axios from "./axios.js";

export const getPartnerIdRequest = async (partner_ID) => {
  //Select the partner that matches the partner_ID sent by parameter
  const request = await axios.get(`/partners/get/${partner_ID}`);
  return request.data;
}; //[USED]

export const putPartnerIdRequest = async (newData) => {
  //Update a partner
  const request = await axios.put("/partners/update", newData);
  return request.data;
}; //[USED]

export const putPartnerIdPasswordRequest = async (partner_ID, newData) => {
  //Update a partner's password
  const request = await axios.put(`/partners/password/update/${partner_ID}`, newData);
  return request.data;
}; //[USED]

export const deletePartnerRequest = async (partner_ID) => {
  //Delete a partner that matches the partner_ID sent by parameter, all its hotels and all its reservations
  const request = await axios.delete(`/partners/delete/${partner_ID}`);
  return request.data;
}; //[USED]
