import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarMenu from "../components/Navbars/NavbarMenu";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import { getHotelIdRequest, putHotelRequest } from "../api/hotels.api";
import {
  getImagesPerHotelRequest,
  deleteImageRequest,
  deleteArrayImagesRequest,
} from "../api/images.api";

function UpdateHotel() {
  const { hotel_ID } = useParams();
  const { logout, partner, error, setError } = usePartnerContext();
  const {
    images,
    setImages,
    hotelData,
    setHotelData,
    handleImageUpdate,
    handleMoreImagesUpdate,
    setRedirect,
    setErrorRedirect,
  } = useHotelContext();
  const [load, setLoad] = useState("Update");

  const navigate = useNavigate();

  useEffect(() => {
    const clickGetHotel = async () => {
      try {
        const data = await getHotelIdRequest(hotel_ID);
        setHotelData(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    const clickGetImagesPerHotel = async () => {
      try {
        const data = await getImagesPerHotelRequest(hotel_ID);
        setImages({ ...images, moreImages: data });
        setHotelData((prevHotelData) => ({
          ...prevHotelData,
          moreImages: data,
        }));
      } catch (error) {
        setImages([]);
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetHotel();
    clickGetImagesPerHotel();
  }, []);

  const deleteMoreImages = async (id) => {
    try {
      const data = await deleteArrayImagesRequest(id);
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const deletePrincipal = async (id) => {
    try {
      const data = await deleteImageRequest(id);
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const updateHotel = async (newData) => {
    try {
      const data = await putHotelRequest(hotel_ID, newData);
      setLoad("Loading...");
      setTimeout(() => {
        navigate("/loginProperty");
        setLoad("Update");
      }, 3000);
      return data;
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (typeof hotelData.principalImg !== "string") {
      deletePrincipal(hotel_ID);
      console.log("La principalImg es un file");
      handleImageUpdate(hotel_ID, hotelData.principalImg);
    }
    if (!Array.isArray(hotelData.moreImages)) {
      if (hotelData.moreImages !== undefined) {
        // no se porque a veces es undefined
        deleteMoreImages(hotel_ID);
      }
      console.log("moreImages es un fileList");
      handleMoreImagesUpdate(hotel_ID, hotelData.moreImages);
    }
    console.log(hotelData);
    updateHotel(hotelData); // info del hotel + imagenes nuevas en formato nombre
  };

  return (
    <>
      <NavbarMenu
        navigation={`/partners/${partner.first_name}`}
        profile={partner}
        logout={logout}
      />
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3>Update Hotel {hotel_ID}</h3>
        <div className="container-errors">
          {error === "Hotel already exists" ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={hotelData.name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                setHotelData({ ...hotelData, name: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="price_per_night">Price per Night</label>
            <input
              id="price_per_night"
              type="number"
              value={hotelData.price_per_night}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, price_per_night: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              value={hotelData.description}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="services">Services</label>
            <input
              id="services"
              type="text"
              value={hotelData.services}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, services: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={hotelData.location}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, location: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="number"
              value={hotelData.phone}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="type-file col s12">
            <div className="file-select" id="src-file1">
              <input
                name="principalImg"
                id="principalImg"
                type="file"
                className="validate"
                onChange={(e) => {
                  setHotelData({
                    ...hotelData,
                    principalImg: e.target.files[0],
                  });
                  setImages({
                    ...images,
                    principalImg: hotelData.principalImg,
                  });
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.principalImg === undefined ? (
                <span>No file selected.</span>
              ) : (
                <span>
                  {hotelData.principalImg.name
                    ? hotelData.principalImg.name
                    : "Principal File Selected."}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="type-file col s12">
            <div className="file-select" id="src-file2">
              <input
                name="moreImages"
                id="moreImages"
                type="file"
                multiple={true}
                className="validate"
                onChange={(e) => {
                  setHotelData({
                    ...hotelData,
                    moreImages: e.target.files,
                  });
                  setImages({
                    ...images,
                    moreImages: hotelData.moreImages,
                  });
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.moreImages === undefined ? (
                <span>No file selected.</span>
              ) : (
                <span>Other Files Selected.</span>
              )}
            </div>
          </div>
        </div>
        <div className="container-button-login-register-partner">
          <button type="submit" className="waves-effect waves-light btn">
            {load}
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateHotel;
