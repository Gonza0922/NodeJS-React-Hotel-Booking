import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postHotelRequest } from "../api/hotels.api";
import { usePartnerContext } from "../context/PartnerContext";
import NavbarMenu from "../components/Navbars/NavbarMenu";
import { useHotelContext } from "../context/HotelContext";

function CreateHotel() {
  const { logout, partner, error, setError } = usePartnerContext();
  const {
    images,
    setImages,
    hotelData,
    setHotelData,
    handleImageCreate,
    handleMoreImagesCreate,
  } = useHotelContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [load, setLoad] = useState("Create");

  const navigate = useNavigate();

  const createHotel = async (hotel) => {
    try {
      const data = await postHotelRequest(hotel);
      setLoad("Loading...");
      setTimeout(() => {
        navigate(`/partners/${partner.first_name}`);
        setLoad("Create");
      }, 3000);
      return data;
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    data.principalImg = data.principalImg[0];
    const hotelCreated = await createHotel(data);
    handleImageCreate(hotelCreated.hotel_ID, data.principalImg);
    handleMoreImagesCreate(hotelCreated.hotel_ID, data.moreImages);
  });

  return (
    <>
      <NavbarMenu
        navigation={`/partners/${partner.first_name}`}
        profile={partner}
        logout={logout}
      />
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3>Register Hotel</h3>
        <div className="container-errors">
          {error === "Hotel already exists" ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="name"
              type="text"
              className="validate"
              autoComplete="off"
              {...register("name", {
                required: { value: true, message: "Name is required" },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Name must be no more than 20 characters.",
                },
              })}
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
              {...register("price_per_night", {
                required: {
                  value: true,
                  message: "Price per Night is required",
                },
                minLength: {
                  value: 2,
                  message: "Price per Night must be at least 2 characters",
                },
                maxLength: {
                  value: 20,
                  message:
                    "Price per Night must be no more than 20 characters.",
                },
              })}
            />
            <label htmlFor="price_per_night">Price per Night</label>
            <div className="container-span">
              {errors.price_per_night && (
                <span>{errors.price_per_night.message}</span>
              )}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="description"
              type="text"
              className="validate"
              autoComplete="off"
              {...register("description", {
                required: { value: true, message: "Description is required" },
                minLength: {
                  value: 8,
                  message: "Description must be 8 characters",
                },
              })}
            />
            <label htmlFor="description">Description</label>
            <div className="container-span">
              {errors.description && <span>{errors.description.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="services"
              type="text"
              className="validate"
              autoComplete="off"
              {...register("services", {
                required: { value: true, message: "Services is required" },
                minLength: {
                  value: 10,
                  message: "Services must be at least 10 characters",
                },
              })}
            />
            <label htmlFor="services">Services</label>
            <div className="container-span">
              {errors.services && <span>{errors.services.message}</span>}
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
              {...register("location", {
                required: { value: true, message: "Location is required" },
                minLength: {
                  value: 5,
                  message: "Location must be at least 5 characters",
                },
              })}
            />
            <label htmlFor="location">Location</label>
            <div className="container-span">
              {errors.location && <span>{errors.location.message}</span>}
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
              {...register("phone", {
                required: { value: true, message: "Phone is required" },
                minLength: {
                  value: 10,
                  message: "Phone must be at least 10 characters",
                },
                maxLength: {
                  value: 11,
                  message: "Phone must be no more than 11 characters.",
                },
              })}
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
                {...register("principalImg", {
                  required: {
                    value: true,
                    message: "principalImg is required",
                  },
                })}
                onChange={(e) => {
                  setHotelData((prevElement) => ({
                    ...prevElement,
                    principalImg: e.target.files[0],
                  }));
                  setImages((prevElement) => ({
                    ...prevElement,
                    principalImg: e.target.files[0],
                  }));
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.principalImg === undefined ? (
                <span>Ninguno archivo selec.</span>
              ) : (
                <span>
                  {hotelData.principalImg.name
                    ? hotelData.principalImg.name
                    : "Imagen Principal"}
                </span>
              )}
            </div>
            <div className="container-span">
              {images.principalImg === null ? (
                errors.principalImg && (
                  <span>{errors.principalImg.message}</span>
                )
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
                {...register("moreImages", {
                  required: {
                    value: true,
                    message: "More Images are required",
                  },
                })}
                onChange={(e) => {
                  setHotelData((prevElement) => ({
                    ...prevElement,
                    moreImages: e.target.files,
                  }));
                  setImages((prevElement) => ({
                    ...prevElement,
                    moreImages: e.target.files,
                  }));
                }}
              />
            </div>
            <div className="message-files">
              {hotelData.moreImages === undefined ? (
                <span>Ninguno archivo selec.</span>
              ) : (
                <span>Archivos selecccionados.</span>
              )}
            </div>
            <div className="container-span">
              {images.moreImages === null ? (
                errors.moreImages && <span>{errors.moreImages.message}</span>
              ) : (
                <p></p>
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

export default CreateHotel;
