import axios from "./axios.js";

export const getImagesPerHotelRequest = async (hotel_ID) => {
  //Selecciona todas las imagenes del hotel enviado por parametro
  const request = await axios.get(`/images/all/${hotel_ID}`);
  return request.data;
}; //[SE USA] 2

export const postImageRequest = async (hotel_ID, formData) => {
  //Guarda la imagen del hotel
  const request = await axios.post(
    `/images/create/single/${hotel_ID}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return request.data;
}; //[SE USA]

export const postMoreImagesRequest = async (hotel_ID, formData) => {
  //Guarda mas imagenes del hotel
  const request = await axios.post(
    `/images/create/multiple/${hotel_ID}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return request.data;
}; //[SE USA]

export const updateImageRequest = async (hotel_ID, formData) => {
  //Guarda la imagen del hotel
  const request = await axios.post(
    `/images/update/single/${hotel_ID}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return request.data;
}; //[SE USA]

export const updateMoreImagesRequest = async (hotel_ID, formData) => {
  //Guarda mas imagenes del hotel
  const request = await axios.post(
    `/images/update/multiple/${hotel_ID}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return request.data;
}; //[SE USA]

export const deleteImageRequest = async (hotel_ID) => {
  //Elimina la imagen de principal del hotel en clodinary
  try {
    const request = await axios.get(`/images/delete/single/${hotel_ID}`);
    return request.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}; //[SE USA] 2

export const deleteArrayImagesRequest = async (hotel_ID) => {
  //Elimina la imagen de principal del hotel en clodinary
  try {
    const request = await axios.get(`/images/delete/multiple/${hotel_ID}`);
    return request.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}; //[SE USA] 2
