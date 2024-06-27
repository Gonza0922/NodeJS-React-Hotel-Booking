import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import { transformDateZ } from "../functions/dates.js";
import { verifyTokenPINRequest } from "../api/comment.api";
import Cookie from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { reservationSchema } from "../validations/reservation.validation.js";

function Home() {
  const { isAuthenticated, user, error, setError } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
      if (!cookies.TokenPIN) {
        return setIsPIN(false);
      }
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
    data = { ...data, guests: Number(data.guests) };
    setDatosUsar({ ...data, hotel_ID, doIt: false });
    createReservation({ ...data, hotel_ID, doIt: false });
  });

  const verificationPIN = async (e, data) => {
    e.preventDefault();
    console.log(data);
    try {
      setIsPIN(true);
      await verifyPINRequest(hotel_ID, data);
      setConfirmation("Create Comment");
    } catch (error) {
      console.log(error);
      document.body.style.overflowY = "auto";
      setError(error.response.data.message[0]);
    }
  };

  // const createComment = async () => {
  //      //cargando la pagina
  //   try {
  //     await postCommentRequest({ content: comment, hotel_ID });
  //   } catch (error) {
  //     console.log(error);
  //     setError(error.response.data.message);
  //   }
  // };

  const createComment = async (e) => {
    //sin cargar la pagina pero debemos crear un useffect para cargar comments cada vez q cambie el (confirmation)
    e.preventDefault();
    try {
      await postCommentRequest({ content: comment, hotel_ID });
      document.body.style.overflowY = "auto";
      setConfirmation(null);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message[0]);
    }
  };

  return (
    <>
      {!isAuthenticated ? <NavbarWithOutSearching /> : <NavbarUserWithOutSearching />}
      <div className="images">
        <div className="principal">
          <img src={hotel.principalImg ? hotel.principalImg : import.meta.env.VITE_NONE_IMAGE} />
        </div>
        <div className="image-flex">
          <div id="image" className="container-image-2">
            <img
              src={images.length > 0 ? images[0].image_name : import.meta.env.VITE_NONE_IMAGE}
              alt={"image 1"}
            />
          </div>
          <div id="image" className="container-image-3">
            <img
              src={images.length > 1 ? images[1].image_name : import.meta.env.VITE_NONE_IMAGE}
              alt={"image 2"}
            />
          </div>
        </div>
        <div className="image-flex">
          <div id="image" className="container-image-4">
            <img
              className="img-4"
              src={images.length > 2 ? images[2].image_name : import.meta.env.VITE_NONE_IMAGE}
              alt={"image 3"}
            />
          </div>
          <div id="image" className="container-image-5">
            <img
              className="img-5"
              src={images.length > 3 ? images[3].image_name : import.meta.env.VITE_NONE_IMAGE}
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
              <h5>{confirmation}</h5>
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
              <h5>{confirmation}</h5>
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
              <input id="check_in" type="date" className="validate" {...register("check_in")} />
              <label htmlFor="check_in">Check In</label>
              <div className="container-span">
                {errors.check_in && <span>{errors.check_in.message}</span>}
              </div>
            </div>
            <div className="input-field col s6">
              <input id="check_out" type="date" className="validate" {...register("check_out")} />
              <label htmlFor="check_out">Check Out</label>
              <div className="container-span">
                {errors.check_out && <span>{errors.check_out.message}</span>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <Controller
                name="guests"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <select {...field} className="browser-default">
                    <option value="" disabled>
                      Guests
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
                {errors.guests && <span>{errors.guests.message}</span>}
              </div>
            </div>
            <div className="input-field col s6">
              <Controller
                name="room_type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <select {...field} className="browser-default">
                    <option value="" disabled>
                      Room Type
                    </option>
                    <option value="Individual">Individual</option>
                    <option value="Doble">Doble</option>
                    <option value="Triple">Triple</option>
                    <option value="Familiar">Familiar</option>
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
      <div>
        <div className="container-button-comment">
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
      {confirmation === "Verify PIN" ? (
        <div className="comment-container">
          <div className="comment">
            <button
              className="button-back"
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
                {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
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
              <button type="submit" id="comment" className="waves-effect waves-light btn">
                Rate your stay
              </button>
              <p className="info-verify-PIN">
                Only a customer who booked through Hotels.com and stayed at a specific property
                can write a review. This lets us know our reviews come from real guests like you.
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
              className="button-back"
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
                {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
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
      <div className="container-hotel-form">
        {commentsWithUser.map((comment, index) => (
          <div key={index} id="card-selected" className="card">
            <div className="card-content">
              {
                <div className="profile">
                  <div className="initial">{comment.first_name.split("")[0]}</div>
                  <div className="name">
                    {comment.first_name} {comment.last_name}
                    <p className="comment-nacionality">Argentina</p>
                  </div>
                </div>
              }
              <div className="reviewed">Reviewed: {transformDateZ(comment.comment_date)}</div>
              <p className="content">"{comment.content}"</p>
            </div>
          </div>
        ))}
      </div>
      <footer className="footer"></footer>
    </>
  );
}

export default Home;
