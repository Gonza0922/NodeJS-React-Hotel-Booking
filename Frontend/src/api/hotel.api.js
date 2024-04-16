import axios from "./axios.js";

export const getAllHotelsRequest = async () => {
  //Selecciona todos los hoteles
  const request = await axios.get("/partner/all/hotels");
  return request.data;
}; //[SE USA] 2

export const getHotelIdRequest = async (hotel_ID) => {
  //Selecciona el hotel que coincida con el hotel_ID enviado por parametro
  const request = await axios.get(`/partner/hotels/${hotel_ID}`);
  return request.data;
}; //[SE USA] 3

export const getHotelPartnerRequest = async () => {
  //Selecciona el/los hoteles creados por el partner_ID, seleccionado al validar el PartnerToken
  const request = await axios.get("/partner/per_partner/hotels");
  return request.data;
}; //[SE USA]

export const postHotelRequest = async (hotel) => {
  //Crea un hotel
  const request = await axios.post("/partner/create/hotels", hotel);
  return request.data;
}; //[SE USA]

export const putHotelRequest = async (hotel_ID, newHotel) => {
  //Actualiza un hotel que coincida con el hotel_ID enviado por parametro
  const request = await axios.put(
    `/partner/update/hotels/${hotel_ID}`,
    newHotel
  );
  return request.data;
}; //[SE USA]

export const deleteHotelRequest = async (hotel_ID) => {
  //Elimina un hotel que coincida con el hotel_ID enviado
  const request = await axios.delete(`/partner/delete/hotels/${hotel_ID}`);
  return request.data;
}; //[SE USA]
