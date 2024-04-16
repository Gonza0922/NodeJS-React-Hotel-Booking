import { useState, useEffect, createContext, useContext } from "react";
import { getAllHotelsRequest } from "../api/hotels.api";
import {
  postImageRequest,
  postMoreImagesRequest,
  updateImageRequest,
  updateMoreImagesRequest,
} from "../api/images.api";

const hotelContext = createContext();

export function useHotelContext() {
  return useContext(hotelContext);
}

const HotelProvider = (props) => {
  const [hotel, setHotel] = useState({});
  const [hotels, setHotels] = useState([]);
  const [content, setContent] = useState([]);
  const [hotelSearch, setHotelSearch] = useState("");
  const [reservations, setReservations] = useState([]);
  const [images, setImages] = useState({
    principalImg: null,
    moreImages: null,
  });
  const [hotelData, setHotelData] = useState({
    name: "",
    price_per_night: "",
    description: "",
    services: "",
    location: "",
    phone: "",
    principalImg: undefined,
    moreImages: undefined,
  });
  const [redirect, setRedirect] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState({});

  useEffect(() => {
    const getHotels = async () => {
      const data = await getAllHotelsRequest();
      setHotels(data);
      setContent(data);
    };
    getHotels();
  }, []);

  const filtrar = (term) => {
    const result = content.filter((element) => {
      if (element.name.toString().toLowerCase().includes(term.toLowerCase())) {
        return element;
      }
    });
    setHotels(result);
  };

  const handleImageCreate = async (hotel_ID, image) => {
    const formData = new FormData();
    formData.append("principalImg", image);
    try {
      await postImageRequest(hotel_ID, formData);
      console.log("Image successfully uploaded to cloudinary");
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleMoreImagesCreate = async (hotel_ID, images) => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("moreImages", images[i]);
    }
    try {
      await postMoreImagesRequest(hotel_ID, formData);
      console.log("Images successfully uploaded to cloudinary");
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  const handleImageUpdate = async (hotel_ID, image) => {
    const formData = new FormData();
    formData.append("principalImg", image);
    try {
      await updateImageRequest(hotel_ID, formData);
      console.log("Image updated successfully in cloudinary and database");
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleMoreImagesUpdate = async (hotel_ID, images) => {
    const formData = new FormData();
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("moreImages", images[i]);
      }
      try {
        await updateMoreImagesRequest(hotel_ID, formData);
        console.log("Images updated correctly in cloudinary and database");
      } catch (error) {
        console.error("Failed to upload images:", error);
      }
    } else {
      console.log("No image will be updated since nothing was inserted");
    }
  };

  return (
    <hotelContext.Provider
      value={{
        hotel,
        setHotel,
        hotels,
        setHotels,
        hotelSearch,
        setHotelSearch,
        filtrar,
        images,
        setImages,
        hotelData,
        setHotelData,
        reservations,
        setReservations,
        handleImageCreate,
        handleMoreImagesCreate,
        handleImageUpdate,
        handleMoreImagesUpdate,
        redirect,
        setRedirect,
        errorRedirect,
        setErrorRedirect,
      }}
    >
      {props.children}
    </hotelContext.Provider>
  );
};

export default HotelProvider;
