import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getHotelIdRequest } from "../api/hotel.api";
import { postReservationRequest } from "../api/reservation.api.js";
import { getImagesPerHotelRequest } from "../api/images.api.js";
import { useUserContext } from "../context/UserContext.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";
import NavbarWithOutSearching from "../components/Navbars/NavbarWithOutSearching.jsx";
import NavbarUserWithOutSearching from "../components/Navbars/NavbarUserWithOutSearching.jsx";
import {
  getCommentPerHotelRequest,
  postCommentRequest,
  verifyPINRequest,
} from "../api/comment.api.js";
import { getUserIdRequest } from "../api/user.api.js";
import { verifyTokenPINRequest } from "../api/comment.api";
import Cookie from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { reservationSchema } from "../validations/reservation.validation.js";
import ReservationOption from "../components/ReservationOption.jsx";
import SliderComponent from "../components/Slider.jsx";

function Home() {
  const { isAuthenticated, user, error, setError } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(reservationSchema) });
  const {
    hotel,
    setHotel,
    images,
    setImages,
    setRedirect,
    setErrorRedirect,
    commentsWithUser,
    setCommentsWithUser,
    isPIN,
    setIsPIN,
    guestsAndRoomType,
  } = useHotelContext();
  const [confirmation, setConfirmation] = useState(null);
  const [datosUsar, setDatosUsar] = useState(null);
  const [comment, setComment] = useState("");
  const [reservationData, setReservationData] = useState({
    reservation_ID: undefined,
    PIN: undefined,
  });
  const { hotel_ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPIN = async () => {
      const cookies = Cookie.get();
      if (!cookies.TokenPIN) return setIsPIN(false);
      try {
        const PIN = await verifyTokenPINRequest(hotel_ID, cookies.TokenPIN);
        if (!PIN) return setIsPIN(false);
        setIsPIN(true);
      } catch (error) {
        setIsPIN(false);
        console.log(error);
      }
    };
    verifyPIN();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clickGetCommentsAndUser = async () => {
    try {
      const commentsData = await getCommentPerHotelRequest(hotel_ID);
      const userPromise = commentsData.map(async (comment) => {
        return await getUserIdRequest(comment.user_ID);
      });
      const usersData = await Promise.all(userPromise);
      const finalResult = commentsData.map((comment, index) => {
        return {
          ...comment,
          first_name: usersData[index].first_name,
          last_name: usersData[index].last_name,
          nacionality: usersData[index].nacionality,
        };
      });
      setCommentsWithUser(finalResult);
    } catch (error) {
      setRedirect(true);
      setErrorRedirect(error.message);
    }
  };

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
    clickGetCommentsAndUser();
    clickGetHotel();
    clickGetImagesPerHotel();
  }, []);

  useEffect(() => {
    if (confirmation === null) {
      clickGetCommentsAndUser();
    }
  }, [confirmation]);

  const createReservation = async (reservation) => {
    try {
      await postReservationRequest(reservation);
      setConfirmation("Correctly booked hotel");
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      if (e.message === "You have already made a reservation at that hotel") {
        setError([]);
      } else e.message ? setError(e.message) : setError(e.error);
      setConfirmation(e.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    data = { ...data, ...guestsAndRoomType };
    console.log(data);
    setDatosUsar({ ...data, hotel_ID });
    createReservation({ ...data, hotel_ID });
  });

  const verificationPIN = async (e, data) => {
    e.preventDefault();
    console.log(data);
    try {
      const result = await verifyPINRequest(hotel_ID, data);
      if (result) {
        setIsPIN(true);
        setConfirmation("Create Comment");
      }
    } catch (error) {
      console.log(error.response.data.message);
      const e = error.response.data;
      e.message ? setError(e.message) : setError([e.error]);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    try {
      await postCommentRequest({ content: comment, hotel_ID });
      document.body.style.overflowY = "auto";
      setConfirmation(null);
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError([e.error]);
    }
  };

  return (
    <>
      {!isAuthenticated ? <NavbarWithOutSearching /> : <NavbarUserWithOutSearching />}
      <main>
        <div className="container-hotel-cards">
          <div className="images-gallery">
            <div className="principal">
              <img
                src={hotel.principalImg ? hotel.principalImg : import.meta.env.VITE_NONE_IMAGE}
              />
            </div>
            <div id="container-image" className="container-image-2">
              <img
                src={images.length > 0 ? images[0].image_name : import.meta.env.VITE_NONE_IMAGE}
                alt={"image 1"}
              />
            </div>
            <div id="container-image" className="container-image-3">
              <img
                className="img-3"
                src={images.length > 1 ? images[1].image_name : import.meta.env.VITE_NONE_IMAGE}
                alt={"image 2"}
              />
            </div>
            <div id="container-image" className="container-image-4">
              <img
                src={images.length > 2 ? images[2].image_name : import.meta.env.VITE_NONE_IMAGE}
                alt={"image 3"}
              />
            </div>
            <div id="container-image" className="container-image-5">
              <img
                className="img-5"
                src={images.length > 3 ? images[3].image_name : import.meta.env.VITE_NONE_IMAGE}
                alt={"image 4"}
              />
            </div>
          </div>
          <div className="container-hotel-info">
            <div id="hotel-selected-card" className="card">
              <div className="card-content">
                <span className="card-title">{hotel.name}</span>
                <h5>${hotel.price_per_night}</h5>
                <pre>{hotel.description}</pre>
                <h6>{hotel.services}</h6>
                <h6>{hotel.location}</h6>
                <h6>{hotel.phone}</h6>
              </div>
            </div>
            <form className="availability-form col s12" onSubmit={onSubmit}>
              <h3>Availability</h3>
              <div className="container-errors">
                {typeof error === "string" ? <div className="error">{error}</div> : <div></div>}
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="check_in"
                    type="date"
                    className="validate"
                    {...register("check_in")}
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
                    {...register("check_out")}
                  />
                  <label htmlFor="check_out">Check Out</label>
                  <div className="container-span">
                    {errors.check_out && <span>{errors.check_out.message}</span>}
                  </div>
                </div>
              </div>
              <div className="row">
                <ReservationOption
                  guests={1}
                  room_type={"Individual"}
                  price_per_night={hotel.price_per_night}
                />
                <ReservationOption
                  guests={2}
                  room_type={"Doble"}
                  price_per_night={hotel.price_per_night}
                />
                <ReservationOption
                  guests={3}
                  room_type={"Triple"}
                  price_per_night={hotel.price_per_night}
                />
                <ReservationOption
                  guests={5}
                  room_type={"Familiar"}
                  price_per_night={hotel.price_per_night}
                />
              </div>
            </form>
          </div>
          <div>
            <hr />
            <br />
            <div className="container-button-comment">
              <h5 className="clients-reviews-h5">Clients Reviews</h5>
              <button
                type="submit"
                id="comment"
                onClick={() => {
                  if (!isAuthenticated) return navigate("/login");
                  document.body.style.overflowY = "hidden";
                  if (isPIN) return setConfirmation("Create Comment");
                  setConfirmation("Verify PIN");
                }}
                className="waves-effect waves-light btn"
              >
                Write a review
              </button>
            </div>
          </div>
          {commentsWithUser.length > 0 ? (
            <SliderComponent comments={commentsWithUser} />
          ) : (
            <div className="container-no-reviews">
              <h5 className="no-reviews">No Reviews...</h5>
            </div>
          )}
        </div>
        {confirmation === "You have already made a reservation at that hotel" ? (
          <div className="delete-confirm-container">
            <div className="delete-confirm">
              <h5>{confirmation}</h5>
              <div className="container-button-delete-confirm">
                <button
                  onClick={() => {
                    document.body.style.overflowY = "auto";
                    navigate(`/users/${user.first_name}/reservations`);
                    window.scrollTo(0, 0);
                  }}
                  className="button-delete-confirm waves-effect waves-light btn blue darken-2"
                >
                  My reservations
                </button>
                <button
                  onClick={() => {
                    if (datosUsar !== null) {
                      createReservation({ ...datosUsar, reserveAnyway: true });
                    } else {
                      console.log("Error al enviar los datos");
                      console.log(datosUsar);
                    }
                  }}
                  className="button-delete-confirm waves-effect waves-light btn"
                >
                  Reserve Now
                </button>
                <button
                  onClick={() => {
                    setConfirmation(null);
                    document.body.style.overflowY = "auto";
                  }}
                  className="button-delete-confirm waves-effect waves-light btn red darken-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : confirmation === "Correctly booked hotel" ? (
          <div className="delete-confirm-container">
            <div className="delete-confirm">
              <h5>{confirmation}</h5>
              <button
                onClick={() => {
                  document.body.style.overflowY = "auto";
                  navigate(`/users/${user.first_name}`);
                }}
                className="button-delete-confirm waves-effect waves-light btn blue darken-2"
              >
                Great
              </button>
            </div>
          </div>
        ) : (
          <p></p>
        )}
        {confirmation === "Verify PIN" ? (
          <div className="comment-container">
            <div className="comment">
              <button
                className="comment_button-back"
                onClick={() => {
                  setConfirmation(null);
                  document.body.style.overflowY = "auto";
                }}
              >
                {"X"}
              </button>
              <form
                id="comment-form"
                className="input-field col s12"
                onSubmit={(e) => verificationPIN(e, reservationData)}
              >
                <h5>Enter your Reservation details</h5>
                <p>Check your booking confirmation email to find your booking number and PIN</p>
                <div className="container-errors">
                  {error.length > 0 ? <div className="error">{error[0]}</div> : <div></div>}
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <label htmlFor="reservation_id">Reservation ID</label>
                    <input
                      id="reservation_id"
                      type="number"
                      onChange={(e) =>
                        setReservationData({
                          ...reservationData,
                          reservation_ID: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <label htmlFor="PIN">PIN</label>
                    <input
                      id="PIN"
                      type="number"
                      onChange={(e) =>
                        setReservationData({
                          ...reservationData,
                          PIN: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <button id="comment" className="waves-effect waves-light btn">
                  Rate your stay
                </button>
                <p className="info-verify-PIN">
                  Only a customer who booked through Hotels.com and stayed at a specific property
                  can write a review. This lets us know our reviews come from real guests like
                  you.
                </p>
              </form>
            </div>
          </div>
        ) : (
          <p></p>
        )}
        {confirmation === "Create Comment" ? (
          <div className="comment-container">
            <div className="comment">
              <button
                className="comment_button-back"
                onClick={() => {
                  setConfirmation(null);
                  document.body.style.overflowY = "auto";
                }}
              >
                {"<="}
              </button>
              <form
                id="comment-form"
                className="input-field col s12"
                onSubmit={(e) => createComment(e)}
              >
                <h5>{confirmation}</h5>
                <div className="container-errors">
                  {error.length > 0 ? <div className="error">{error[0]}</div> : <div></div>}
                </div>
                <textarea
                  id="create-comment"
                  type="text"
                  className="validate"
                  placeholder="Hotel was..."
                  spellCheck={false}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" id="comment" className="waves-effect waves-light btn">
                  Create
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </main>
    </>
  );
}

export default Home;
