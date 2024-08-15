import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import NavbarMenu from "../components/Navbars/NavbarMenu";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import { getHotelIdRequest, putHotelRequest } from "../api/hotel.api";
import { getImagesPerHotelRequest } from "../api/images.api";
import { yupResolver } from "@hookform/resolvers/yup";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(updateHotelSchema) });
  const [dataInicializator, setDataInicializator] = useState(false);

  const [moreImages] = useState(Array(4).fill(null));

  const navigate = useNavigate();

  useEffect(() => {
    reset(hotelData);
  }, [dataInicializator]);

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
        setDataInicializator(true);
      } catch (error) {
        setImages([]);
        setRedirect(true);
        setErrorRedirect(error.response.data.message);
        console.log(error);
      }
    };
    clickGetHotel();
    clickGetImagesPerHotel();
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

  const updateHotel = async (newData) => {
    try {
      const moreImages = [];
      for (let i = 1; i < 5; i++) {
        if (hotelData[`moreImage${i}`] && hotelData[`moreImage${i}`].img) {
          moreImages.push(hotelData[`moreImage${i}`].img);
        }
      }
      if (typeof hotelData.principalImg !== "string") {
        console.log(hotelData.principalImg.img);
        handleImageUpdate(hotel_ID, hotelData.principalImg.img);
      }
      if (moreImages.length > 0) {
        console.log(moreImages);
        handleMoreImagesUpdate(hotel_ID, moreImages);
      }
      const data = await putHotelRequest(hotel_ID, newData);
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
      const hotelUpdated = await updateHotel(data); // hotel info + new images in name format
      if (hotelUpdated) {
        navigate("/partners/Hotel");
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <form className="create-update-hotel col s12" onSubmit={onSubmit}>
        <h3 className="center-title">Update "{hotelData.name}"</h3>
        <div className="container-sections-create-and-update-hotel">
          <div className="first-section-create-and-update-hotel">
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="validate"
                  autoComplete="off"
                  value={hotelData.name}
                  spellCheck={false}
                  {...register("name", {
                    onChange: (e) => {
                      setHotelData({ ...hotelData, name: e.target.value });
                    },
                  })}
                />
                <div className="container-span">
                  {errors.name && <span>{errors.name.message}</span>}
                </div>
              </div>
            </div>
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="price_per_night">Price per Night</label>
                <input
                  id="price_per_night"
                  type="number"
                  className="validate"
                  autoComplete="off"
                  value={hotelData.price_per_night}
                  spellCheck={false}
                  {...register("price_per_night", {
                    onChange: (e) => {
                      setHotelData({
                        ...hotelData,
                        price_per_night: e.target.value,
                      });
                    },
                  })}
                />
                <div className="container-span">
                  {errors.price_per_night && <span>{errors.price_per_night.message}</span>}
                </div>
              </div>
            </div>
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  className="validate"
                  autoComplete="off"
                  value={hotelData.location}
                  spellCheck={false}
                  {...register("location", {
                    onChange: (e) => {
                      setHotelData({ ...hotelData, location: e.target.value });
                    },
                  })}
                />
                <div className="container-span">
                  {errors.location && <span>{errors.location.message}</span>}
                </div>
              </div>
            </div>
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="number"
                  className="validate"
                  autoComplete="off"
                  value={hotelData.phone}
                  spellCheck={false}
                  {...register("phone", {
                    onChange: (e) => {
                      setHotelData({ ...hotelData, phone: e.target.value });
                    },
                  })}
                />
                <div className="container-span">
                  {errors.phone && <span>{errors.phone.message}</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="second-section-create-and-update-hotel">
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="create-description">Description</label>
                <textarea
                  id="create-description"
                  type="text"
                  className="materialize-textarea"
                  autoComplete="off"
                  value={hotelData.description}
                  spellCheck={false}
                  {...register("description", {
                    onChange: (e) => {
                      setHotelData({ ...hotelData, description: e.target.value });
                    },
                  })}
                />
                <div className="container-span">
                  {errors.description && <span>{errors.description.message}</span>}
                </div>
              </div>
            </div>
            <div className="row-input">
              <div className="my-input-field col s12">
                <label htmlFor="create-services">Services</label>
                <textarea
                  id="create-services"
                  type="text"
                  className="materialize-textarea"
                  autoComplete="off"
                  value={hotelData.services}
                  spellCheck={false}
                  {...register("services", {
                    onChange: (e) => {
                      setHotelData({ ...hotelData, services: e.target.value });
                    },
                  })}
                />
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
                  : hotelData.principalImg
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
                    : hotelData.moreImages
                    ? hotelData.moreImages[index].image_name
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
          <button type="submit" className="common-button">
            {load}
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateHotel;
