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
  const [result, setResult] = useState({
    principalImg: false,
    moreImages: false,
  });
  const [dataInicializator, setDataInicializator] = useState(false);

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
        setErrorRedirect(error.message);
      }
    };
    clickGetHotel();
    clickGetImagesPerHotel();
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
    if (hotelData.moreImages.length <= 1) {
      setResult((prevElement) => ({
        ...prevElement,
        moreImages: 1,
      }));
      return;
    }
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

  const updateHotel = async (newData) => {
    try {
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
        <h3 className="form-title">Update Hotel {hotel_ID}</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
        </div>
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
            <div className="container-span">
              {errors.moreImages && hotelData.moreImages === undefined ? (
                <span>Other Files are required</span>
              ) : result.moreImages === 1 ? (
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

export default UpdateHotel;
