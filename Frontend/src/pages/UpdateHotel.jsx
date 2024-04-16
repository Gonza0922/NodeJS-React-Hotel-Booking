import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarMenu from "../components/Navbars/NavbarMenu";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import { getHotelIdRequest, putHotelRequest } from "../api/hotel.api";
import { getImagesPerHotelRequest } from "../api/images.api";
import { updateHotelSchema } from "../validations/hotel.validation.js";

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
    load,
    setLoad,
  } = useHotelContext();

  const navigate = useNavigate();

  useEffect(() => {
    setLoad("Update");
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

  const updateHotel = async (newData) => {
    try {
      await updateHotelSchema.validate(newData);
      if (typeof hotelData.principalImg !== "string") {
        console.log("La principalImg es un file");
        handleImageUpdate(hotel_ID, hotelData.principalImg);
      }
      if (!Array.isArray(hotelData.moreImages)) {
        console.log(hotelData.moreImages);
        console.log("moreImages es un fileList");
        handleMoreImagesUpdate(hotel_ID, hotelData.moreImages);
      }
      const data = await putHotelRequest(hotel_ID, newData);
      return data;
    } catch (error) {
      console.log(error);
      error.response
        ? setError(error.response.data.message[0])
        : setError(error.errors[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...hotelData,
      price_per_night: Number(hotelData.price_per_night),
      phone: Number(hotelData.phone),
    };
    console.log(finalData);
    updateHotel(finalData); // info del hotel + imagenes nuevas en formato nombre
    // setLoad("Updating...");
    // setTimeout(() => {
    //   navigate("/loginProperty");
    //   setLoad("Update");
    // }, 3000);
  };

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3>Update Hotel {hotel_ID}</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={hotelData.name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="price_per_night">Price per Night</label>
            <input
              id="price_per_night"
              type="number"
              value={hotelData.price_per_night}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({
                  ...hotelData,
                  price_per_night: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
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
          <div className="my-input-field col s12">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              type="text"
              value={hotelData.description}
              className="materialize-textarea"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="services">Services</label>
            <textarea
              id="services"
              type="text"
              value={hotelData.services}
              className="materialize-textarea"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setHotelData({ ...hotelData, services: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
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
              {hotelData.moreImages === null ? (
                <span>No files selected.</span>
              ) : hotelData.moreImages instanceof FileList ? (
                <span>New Files Selected.</span>
              ) : (
                <span>Old Files Selected.</span>
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
