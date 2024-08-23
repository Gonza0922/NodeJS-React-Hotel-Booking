import { useState, useEffect, createContext, useContext } from "react";
import { getAllHotelsRequest } from "../api/hotel.api";
import { updatePrincipalImageRequest, updateMoreImagesRequest } from "../api/images.api";

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
  const [guestsAndRoomType, setGuestsAndRoomType] = useState({
    guests: undefined,
    room_type: undefined,
  });
  const [idToDelete, setIdToDelete] = useState(undefined);

  useEffect(() => {
    const getHotels = async () => {
      const limit = 1000000;
      const page = 1;
      const { data } = await getAllHotelsRequest(limit, page);
      setHotels(data);
      setContent(data);
    };
    getHotels();
  }, []);

  const filtrar = (term) => {
    const result = content.filter((element) => {
      if (element.location.toString().toLowerCase().includes(term.toLowerCase())) return element;
    });
    setHotels(result);
  };

  const handleImageUpdate = async (hotel_ID, image) => {
    try {
      const formData = new FormData();
      formData.append("principalImg", image);
      await updatePrincipalImageRequest(hotel_ID, formData);
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
        guestsAndRoomType,
        setGuestsAndRoomType,
        idToDelete,
        setIdToDelete,
      }}
    >
      {props.children}
    </hotelContext.Provider>
  );
};

export default HotelProvider;
