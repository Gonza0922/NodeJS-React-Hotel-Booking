import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postHotelRequest } from "../api/hotel.api";
import { usePartnerContext } from "../context/PartnerContext";
import NavbarMenu from "../components/Navbars/NavbarMenu";
import { useHotelContext } from "../context/HotelContext";
import { postImageRequest, postMoreImagesRequest } from "../api/images.api";
import { yupResolver } from "@hookform/resolvers/yup";
import { createHotelSchema } from "../validations/hotel.validation.js";

function CreateHotel() {
  const { logout, partner, error, setError } = usePartnerContext();
  const { hotelData, setHotelData, load, setLoad } = useHotelContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createHotelSchema) });
  const [result, setResult] = useState({
    principalImg: false,
    moreImages: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLoad("Create");
    setHotelData((prevElement) => ({
      ...prevElement,
      principalImg: undefined,
      moreImages: undefined,
    }));
  }, []);

  const validandoTipoPrincipalImg = () => {
    const file = hotelData.principalImg.name;
    if (file) {
      file.includes(".jpg") || file.includes(".jpeg")
        ? setResult((prevElement) => ({
            ...prevElement,
            principalImg: false,
          }))
        : setResult((prevElement) => ({
            ...prevElement,
            principalImg: true,
          }));
    }
  };

  const validandoTipoMoreImages = () => {
    for (let i = 0; i < hotelData.moreImages.length; i++) {
      const file = hotelData.moreImages[i].name;
      if (file) {
        file.includes(".jpg") || file.includes(".jpeg")
          ? setResult((prevElement) => ({
              ...prevElement,
              moreImages: false,
            }))
          : setResult((prevElement) => ({
              ...prevElement,
              moreImages: true,
            }));
      }
    }
  };

  useEffect(() => {
    hotelData.principalImg && validandoTipoPrincipalImg();
  }, [hotelData.principalImg]);

  useEffect(() => {
    hotelData.moreImages && validandoTipoMoreImages();
  }, [hotelData.moreImages]);

  const handleImageCreate = async (hotel_ID, image) => {
    try {
      const formData = new FormData();
      formData.append("principalImg", image);
      await postImageRequest(hotel_ID, formData);
      console.log("Image successfully uploaded to cloudinary");
    } catch (error) {
      console.error("Failed to upload image:", error);
      setError(error.response.data.message);
    }
  };

  const handleMoreImagesCreate = async (hotel_ID, images) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("moreImages", images[i]);
      }
      await postMoreImagesRequest(hotel_ID, formData);
      console.log("Images successfully uploaded to cloudinary");
    } catch (error) {
      console.error("Failed to upload images:", error);
      setError(error.response.data.message);
    }
  };

  const createHotel = async (hotel) => {
    try {
      const data = await postHotelRequest(hotel);
      if (data) {
        setLoad("Creating...");
        setTimeout(() => {
          navigate(`/partners/${partner.first_name}`);
        }, 3000);
      }
      return data;
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      data = {
        ...data,
        price_per_night: Number(data.price_per_night),
        phone: Number(data.phone),
      };
      console.log(data);
      data.principalImg = data.principalImg[0];
      const hotelCreated = await createHotel(data);
      if (hotelCreated) {
        await handleImageCreate(hotelCreated.hotel_ID, data.principalImg);
        await handleMoreImagesCreate(hotelCreated.hotel_ID, data.moreImages);
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <form className="create-update-hotel col s12" onSubmit={onSubmit}>
        <h3>Register Hotel</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="name"
              type="text"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("name")}
            />
            <label htmlFor="name">Name</label>
            <div className="container-span">
              {errors.name && <span>{errors.name.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="price_per_night"
              type="number"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("price_per_night")}
            />
            <label htmlFor="price_per_night">Price per Night</label>
            <div className="container-span">
              {errors.price_per_night && <span>{errors.price_per_night.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="location"
              type="text"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("location")}
            />
            <label htmlFor="location">Location</label>
            <div className="container-span">
              {errors.location && <span>{errors.location.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <textarea
              id="create-description"
              type="text"
              className="materialize-textarea"
              autoComplete="off"
              spellCheck={false}
              {...register("description")}
            />
            <label htmlFor="create-description">Description</label>
            <div className="container-span">
              {errors.description && <span>{errors.description.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <textarea
              id="create-services"
              type="text"
              className="materialize-textarea"
              autoComplete="off"
              spellCheck={false}
              {...register("services")}
            />
            <label htmlFor="create-services">Services</label>
            <div className="container-span">
              {errors.services && <span>{errors.services.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="phone"
              type="number"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("phone")}
            />
            <label htmlFor="phone">Phone</label>
            <div className="container-span">
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <div className="file-select" id="src-file1">
              <input
                name="principalImg"
                id="principalImg"
                type="file"
                className="validate"
                {...register("principalImg")}
                onChange={(e) => {
                  setHotelData((prevElement) => ({
                    ...prevElement,
                    principalImg: e.target.files[0],
                  }));
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.principalImg === undefined ? (
                <span>No file selected</span>
              ) : (
                <span>
                  {hotelData.principalImg.name ? hotelData.principalImg.name : "Principal File"}
                </span>
              )}
            </div>
            <div className="container-span">
              {errors.principalImg && hotelData.principalImg === undefined ? (
                <span>Principal Image is required</span>
              ) : result.principalImg ? (
                <span>Only JPEG and JPG files are allowed</span>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <div className="file-select" id="src-file2">
              <input
                name="moreImages"
                id="moreImages"
                type="file"
                multiple={true}
                className="validate"
                {...register("moreImages")}
                onChange={(e) => {
                  setHotelData((prevElement) => ({
                    ...prevElement,
                    moreImages: e.target.files,
                  }));
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.moreImages === undefined ? (
                <span>No files selected</span>
              ) : (
                <span>Selected files.</span>
              )}
            </div>
            <div className="container-span">
              {errors.moreImages && hotelData.moreImages === undefined ? (
                <span>Other Files are required</span>
              ) : errors.moreImages && hotelData.moreImages.length <= 1 ? (
                <span>Enter more than 1 file</span>
              ) : result.moreImages ? (
                <span>Only JPEG and JPG files are allowed</span>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
        <div className="universal-container-button">
          <button type="submit" className="waves-effect waves-light btn">
            {load}
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateHotel;
