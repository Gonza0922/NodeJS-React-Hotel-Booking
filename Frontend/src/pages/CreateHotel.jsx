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
  const [moreImages] = useState(Array(4).fill(null));

  const navigate = useNavigate();

  useEffect(() => {
    setLoad("Create");
  }, []);

  const handleImageChange = (e, name) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2)
          setHotelData((prevElement) => ({
            ...prevElement,
            [name]: { url: reader.result, img: selectedImage },
          }));
      };
      if (selectedImage) reader.readAsDataURL(selectedImage);
    }
  };

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
      const moreImages = [];
      for (let i = 1; i < 5; i++) {
        if (hotelData[`moreImage${i}`] && hotelData[`moreImage${i}`].img) {
          moreImages.push(hotelData[`moreImage${i}`].img);
        }
      }
      data = {
        ...data,
        price_per_night: Number(data.price_per_night),
        phone: Number(data.phone),
        principalImg: data.principalImg[0],
        moreImages,
      };
      console.log(data);
      if (data.principalImg) {
        const hotelCreated = await createHotel(data);
        if (hotelCreated) {
          await handleImageCreate(hotelCreated.hotel_ID, data.principalImg);
          if (data.moreImages.length > 0)
            await handleMoreImagesCreate(hotelCreated.hotel_ID, data.moreImages);
        }
      } else {
        setError("Please reload the main image");
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
        <div className="container-sections-create-and-update-hotel">
          <div className="first-section-create-and-update-hotel">
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
          </div>
          <div className="second-section-create-and-update-hotel">
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
          </div>
        </div>
        <div className="images-gallery">
          <div className="principal">
            <input
              name="principalImg"
              id="principalImg"
              type="file"
              className="validate"
              {...register("principalImg")}
              onChange={(e) => handleImageChange(e, "principalImg")}
            />
            <img
              src={
                hotelData.principalImg && hotelData.principalImg.url
                  ? hotelData.principalImg.url
                  : import.meta.env.VITE_NONE_IMAGE
              }
              alt="principal image"
            />
          </div>
          {moreImages.map((_, index) => (
            <div key={index + 1} id="container-image" className={`container-image-${index + 1}`}>
              <input
                name="moreImages"
                id="moreImages"
                type="file"
                className="validate"
                onChange={(e) => handleImageChange(e, `moreImage${index + 1}`)}
              />
              <img
                src={
                  hotelData[`moreImage${index + 1}`] && hotelData[`moreImage${index + 1}`].url
                    ? hotelData[`moreImage${index + 1}`].url
                    : import.meta.env.VITE_NONE_IMAGE
                }
                alt={`image ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="container-error-create-update-hotel">
          {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
        </div>
        <div className="universal-container-button">
          <button id="button-padding" type="submit" className="waves-effect waves-light btn">
            {load}
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateHotel;
