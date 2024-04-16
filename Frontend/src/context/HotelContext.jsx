import { useState, useEffect, createContext, useContext } from "react";
import { getAllHotelsRequest } from "../api/hotel.api";
// import { verifyTokenPINRequest } from "../api/comment.api";
// import Cookie from "js-cookie";
import { updateImageRequest, updateMoreImagesRequest } from "../api/images.api";

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
  const [commentsWithUser, setCommentsWithUser] = useState([]);
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
  const [load, setLoad] = useState("");
  const [isPIN, setIsPIN] = useState(false);

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
      if (
        element.location.toString().toLowerCase().includes(term.toLowerCase())
      ) {
        return element;
      }
    });
    setHotels(result);
  };

  const handleImageUpdate = async (hotel_ID, image) => {
    try {
      const formData = new FormData();
      formData.append("principalImg", image);
      await updateImageRequest(hotel_ID, formData);
      console.log("Image updated successfully in cloudinary and database");
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleMoreImagesUpdate = async (hotel_ID, images) => {
    const formData = new FormData();
    if (images) {
      try {
        for (let i = 0; i < images.length; i++) {
          formData.append("moreImages", images[i]);
        }
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
        setContent,
        images,
        setImages,
        hotelData,
        setHotelData,
        reservations,
        setReservations,
        handleImageUpdate,
        handleMoreImagesUpdate,
        redirect,
        setRedirect,
        errorRedirect,
        setErrorRedirect,
        load,
        setLoad,
        commentsWithUser,
        setCommentsWithUser,
        isPIN,
        setIsPIN,
      }}
    >
      {props.children}
    </hotelContext.Provider>
  );
};

export default HotelProvider;
