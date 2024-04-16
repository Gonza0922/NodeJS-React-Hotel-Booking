import axios from "./axios.js";

export const getPartnerIdRequest = async (partner_ID) => {
  //Selecciona el partner que coincida con el partner_ID enviado por parametro
  const request = await axios.get(`/auth/partners/get/${partner_ID}`);
  return request.data;
}; //[SE USA]

export const putPartnerIdRequest = async (newData) => {
  //Actualiza un partner
  const request = await axios.put("/auth/partners/update", newData);
  return request.data;
}; //[SE USA]

export const putPartnerIdPasswordRequest = async (partner_ID, newData) => {
  //Actualiza la contraseña de un partner
  const request = await axios.put(
    `/auth/partners/password/update/${partner_ID}`,
    newData
  );
  return request.data;
}; //[SE USA]

export const registerPartnerRequest = async (partner) => {
  //Registra un partner nuevo
  const request = await axios.post("/auth/partners/register", partner);
  return request.data;
}; //[SE USA]

export const loginPartnerRequest = async (partner) => {
  //Loguea un partner que coincida con los datos enviados
  const request = await axios.post("/auth/partners/login", partner);
  return request.data;
}; //[SE USA]

export const logoutPartnerRequest = async () => {
  //Desloguea un partner
  const request = await axios.post("/auth/partners/logout");
  return request.data;
}; //[SE USA]

export const verifyTokenPartnerRequest = async () => {
  //Verifica si existe/coincide el PartnerToken para ingresar a la cuenta del partner
  const request = await axios.get("/auth/partners/verify");
  return request.data;
}; //[SE USA]

export const deletePartnerRequest = async (partner_ID) => {
  //Elimina un partner que coincida con el partner_ID enviado por parametro
  const request = await axios.delete(`/auth/delete/partners/${partner_ID}`);
  return request.data;
}; //[SE USA]
