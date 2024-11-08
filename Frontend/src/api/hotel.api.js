import axios from "./axios.js";

export const getAllHotelsRequest = async (limit, page) => {
  //Select all hotels
  const request = await axios.get("/hotels/all", {
    params: {
      limit: limit,
      page: page,
    },
  });
  return request.data;
}; //[USED]

export const getHotelIdRequest = async (hotel_ID) => {
  //Select the hotel that matches the hotel_ID sent by parameter
  const request = await axios.get(`/hotels/by_hotel/${hotel_ID}`);
  return request.data;
}; //[USED]

export const getHotelPartnerRequest = async () => {
  //Select the hotel(s) created by the partner_ID, selected when validating the PartnerToken
  const request = await axios.get("/hotels/by_partner");
  return request.data;
}; //[USED]

export const postHotelRequest = async (hotel) => {
  //Create a hotel
  const request = await axios.post("/hotels/create", hotel);
  return request.data;
}; //[USED]

export const putHotelRequest = async (hotel_ID, newHotel) => {
  //Update a hotel that matches the hotel_ID sent by parameter
  const request = await axios.put(`/hotels/update/${hotel_ID}`, newHotel);
  return request.data;
}; //[USED]

export const deleteHotelRequest = async (hotel_ID) => {
  //Delete a hotel that matches the hotel_ID sent by parameter
  const request = await axios.delete(`/hotels/delete/${hotel_ID}`);
  return request.data;
}; //[USED]
