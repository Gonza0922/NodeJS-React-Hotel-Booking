import axios from "./axios.js";

export const getImagesPerHotelRequest = async (hotel_ID) => {
  //Select all images of the hotel sent by parameter
  const request = await axios.get(`/images/all/${hotel_ID}`);
  return request.data;
}; //[USED]

export const postImageRequest = async (hotel_ID, formData) => {
  //Create the principal image
  const request = await axios.post(`/images/create/single/${hotel_ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
}; //[USED]

export const postMoreImagesRequest = async (hotel_ID, formData) => {
  //Create multiple images
  const request = await axios.post(`/images/create/multiple/${hotel_ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
}; //[USED]

export const updatePrincipalImageRequest = async (hotel_ID, formData) => {
  //Update principal image
  const request = await axios.put(`/images/update/single/${hotel_ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
}; //[USED]

export const updateMoreImagesRequest = async (hotel_ID, formData) => {
  //Update multiple images
  const request = await axios.put(`/images/update/multiple/${hotel_ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
}; //[USED]

// export const deleteImageRequest = async (hotel_ID) => {
//   //Delete principal image from the hotel in cloudinary
//   try {
//     const request = await axios.get(`/images/delete/single/${hotel_ID}`);
//     return request.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }; //IT CAN USE

// export const deleteArrayImagesRequest = async (hotel_ID) => {
//   //Delete multiple images from the hotel in cloudinary
//   try {
//     const request = await axios.get(`/images/delete/multiple/${hotel_ID}`);
//     return request.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }; //IT CAN USE
