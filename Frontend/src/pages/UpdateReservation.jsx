import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  getReservationIdRequest,
  putReservationRequest,
} from "../api/reservation.api";
import { transformDateZ } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useUserContext } from "../context/UserContext";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { reservationSchema } from "../validations/reservation.validation.js";

function UpdateReservation() {
  const { reservation_ID } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(reservationSchema) });
  const navigate = useNavigate();
  const { error, setError } = usePartnerContext();
  const { user, logout } = useUserContext();
  const { setRedirect, setErrorRedirect } = useHotelContext();
  const [reservationData, setReservationData] = useState({
    check_in: "",
    check_out: "",
    guests: "",
    room_type: "",
  });

  useEffect(() => {
    const clickGetReservation = async () => {
      try {
        const data = await getReservationIdRequest(reservation_ID);
        setReservationData({
          ...data,
          check_in: transformDateZ(data.check_in),
          check_out: transformDateZ(data.check_out),
        });
        reset({
          ...data,
          check_in: transformDateZ(data.check_in),
          check_out: transformDateZ(data.check_out),
        });
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetReservation();
  }, []);

  const updateReservation = async (newData) => {
    try {
      const data = await putReservationRequest(reservation_ID, newData);
      console.log(data);
      navigate(`/users/${user.first_name}/reservations`);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message[0]);
    }
  };

  const handleClick = handleSubmit(async (data) => {
    try {
      data = {
        ...data,
        check_in: transformDateZ(data.check_in),
        check_out: transformDateZ(data.check_out),
      };
      console.log(data);
      updateReservation(data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <form className="form-update-reservation col s12" onSubmit={handleClick}>
        <h3 className="title-update">Update Reservation {reservation_ID}</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row">
          <div className="my-input-field col s6">
            <label htmlFor="check_in">Check In</label>
            <input
              id="check_in"
              type="date"
              className="validate"
              value={reservationData.check_in}
              spellCheck={false}
              {...register("check_in", {
                onChange: (e) => {
                  setReservationData({
                    ...reservationData,
                    check_in: e.target.value,
                  });
                },
              })}
            />
            <div className="container-span">
              {errors.check_in && <span>{errors.check_in.message}</span>}
            </div>
          </div>
          <div className="my-input-field col s6">
            <label htmlFor="check_out">Check Out</label>
            <input
              id="check_out"
              type="date"
              className="validate"
              value={reservationData.check_out}
              spellCheck={false}
              {...register("check_out", {
                onChange: (e) => {
                  setReservationData({
                    ...reservationData,
                    check_out: e.target.value,
                  });
                },
              })}
            />
            <div className="container-span">
              {errors.check_out && <span>{errors.check_out.message}</span>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="my-input-field col s6">
            <p className="p-update-reservation">Guests</p>
            <Controller
              name="guests"
              control={control}
              defaultValue=""
              rules={{ required: "Guests is required" }}
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
          <div className="my-input-field col s6">
            <p className="p-update-reservation">Room Type</p>
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
        <div className="container-button-login-register-partner">
          <button type="submit" className="waves-effect waves-light btn">
            Update Reservation
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateReservation;
