import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { getHotelIdRequest } from "../api/hotels.api";
import { postReservationRequest } from "../api/reservations.api.js";
import { getImagesPerHotelRequest } from "../api/images.api.js";
import { useUserContext } from "../context/UserContext.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";
import NavbarWithOutSearching from "../components/Navbars/NavbarWithOutSearching.jsx";
import NavbarUserWithOutSearching from "../components/Navbars/NavbarUserWithOutSearching.jsx";

function Home() {
  const { isAuthenticated, user, error, setError } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const { hotel, setHotel, images, setImages, setRedirect, setErrorRedirect } = useHotelContext();
  const [confirmation, setConfirmation] = useState(null);
  const [datosUsar, setDatosUsar] = useState(null);
  const { hotel_ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const clickGetHotel = async () => {
      try {
        const data = await getHotelIdRequest(hotel_ID);
        setHotel(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    const clickGetImagesPerHotel = async () => {
      try {
        const data = await getImagesPerHotelRequest(hotel_ID);
        setImages(data);
      } catch (error) {
        setImages([]);
      }
    };
    clickGetHotel();
    clickGetImagesPerHotel();
  }, []);

  const createReservation = async (reservation, doIt) => {
    try {
      await postReservationRequest(reservation, doIt);
      setConfirmation("Correctly booked hotel");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setConfirmation(error.response.data.message);
    }
  };

  const verify = () => {
    if (!isAuthenticated) return navigate("/login");
  };

  const onSubmit = handleSubmit((data) => {
    data = { ...data, people: Number(data.people) };
    setDatosUsar({ ...data, hotel_ID, doIt: false });
    createReservation({ ...data, hotel_ID, doIt: false });
  });

  return (
    <>
      {!isAuthenticated ? <NavbarWithOutSearching /> : <NavbarUserWithOutSearching />}
      <div className="images">
        <div className="principal">
          <img src={hotel.principalImg} />
        </div>
        <div className="image-flex">
          <div id="image" className="container-image-2">
            <img
              src={
                images.length > 0
                  ? images[0].image_name
                  : `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1708638458/no-image_gjz6mf.png`
              }
              alt={"image 1"}
            />
          </div>
          <div id="image" className="container-image-3">
            <img
              src={
                images.length > 1
                  ? images[1].image_name
                  : `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1708638458/no-image_gjz6mf.png`
              }
              alt={"image 2"}
            />
          </div>
        </div>
        <div className="image-flex">
          <div id="image" className="container-image-4">
            <img
              className="img-4"
              src={
                images.length > 2
                  ? images[2].image_name
                  : `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1708638458/no-image_gjz6mf.png`
              }
              alt={"image 3"}
            />
          </div>
          <div id="image" className="container-image-5">
            <img
              className="img-5"
              src={
                images.length > 3
                  ? images[3].image_name
                  : `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1708638458/no-image_gjz6mf.png`
              }
              alt={"image 4"}
            />
          </div>
        </div>
      </div>
      <div className="container-hotel-form">
        <div id="card-selected" className="card">
          <div className="card-content">
            <span className="card-title">{hotel.name}</span>
            <h5>${hotel.price_per_night}</h5>
            <p>{hotel.description}</p>
            <h6>{hotel.services}</h6>
            <h6>{hotel.location}</h6>
            <h6>{hotel.phone}</h6>
          </div>
        </div>
        {confirmation === "You have already made a reservation at that hotel" ? (
          <div className="delete-confirm-container">
            <div className="delete-confirm">
              <h5>You have already made a reservation at that hotel</h5>
              <div className="container-button-delete-confirm">
                <button
                  onClick={() => navigate(`/users/${user.first_name}/reservations`)}
                  className="button-delete-confirm waves-effect waves-light btn blue darken-2"
                >
                  My reservations
                </button>
                <button
                  onClick={() => {
                    if (datosUsar !== null) {
                      createReservation({ ...datosUsar, doIt: true });
                    } else {
                      console.log("Error al enviar los datos");
                      console.log(datosUsar);
                    }
                  }}
                  className="button-delete-confirm waves-effect waves-light btn"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        ) : confirmation === "Correctly booked hotel" ? (
          <div className="delete-confirm-container">
            <div className="delete-confirm">
              <h5>Correctly booked hotel</h5>
              <button
                onClick={() => navigate(`/users/${user.first_name}`)}
                className="button-delete-confirm waves-effect waves-light btn blue darken-2"
              >
                Great
              </button>
            </div>
          </div>
        ) : (
          <p></p>
        )}
        <form className="form col s12" onSubmit={onSubmit}>
          <h3>Reservation</h3>
          <div className="container-errors">
            {error === "Sorry, the hotel is already booked for those dates" ? (
              <div className="error">{error}</div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                id="check_in"
                type="date"
                className="validate"
                {...register("check_in", {
                  required: { value: true, message: "Check In is required" },
                })}
              />
              <label htmlFor="check_in">Check In</label>
              <div className="container-span">
                {errors.check_in && <span>{errors.check_in.message}</span>}
              </div>
            </div>
            <div className="input-field col s6">
              <input
                id="check_out"
                type="date"
                className="validate"
                {...register("check_out", {
                  required: { value: true, message: "Check Out is required" },
                })}
              />
              <label htmlFor="check_out">Check Out</label>
              <div className="container-span">
                {errors.check_out && <span>{errors.check_out.message}</span>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <Controller
                name="people"
                control={control}
                defaultValue=""
                rules={{ required: "People is required" }}
                render={({ field }) => (
                  <select {...field} className="browser-default">
                    <option value="" disabled>
                      People
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                )}
              />
              <div className="container-span">
                {errors.people && <span>{errors.people.message}</span>}
              </div>
            </div>
            <div className="input-field col s6">
              <Controller
                name="room_type"
                control={control}
                defaultValue=""
                rules={{ required: "Room Type is required" }}
                render={({ field }) => (
                  <select {...field} className="browser-default">
                    <option value="" disabled>
                      Room Type
                    </option>
                    <option value="Individual">Individual</option>
                    <option value="Familiar">Familiar</option>
                    <option value="Doble">Doble</option>
                    {/* <option value="Suite">Suite + $50</option> */}
                  </select>
                )}
              />
              <div className="container-span">
                {errors.room_type && <span>{errors.room_type.message}</span>}
              </div>
            </div>
          </div>
          <div className="container-button-reserve">
            <button
              type="submit"
              onClick={verify}
              id="reserve"
              className="waves-effect waves-light btn"
            >
              Reserve Now
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Home;
