import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getReservationIdRequest, putReservationRequest } from "../api/reservation.api";
import { transformDateZ } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useUserContext } from "../context/UserContext";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { reservationSchema } from "../validations/reservation.validation.js";
import ReservationOption from "../components/ReservationOption.jsx";
import { getHotelIdRequest } from "../api/hotel.api.js";

function UpdateReservation() {
  const { reservation_ID } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(reservationSchema) });
  const navigate = useNavigate();
  const { error, setError } = usePartnerContext();
  const { user, logout } = useUserContext();
  const { setRedirect, setErrorRedirect, guestsAndRoomType } = useHotelContext();
  const [reservationData, setReservationData] = useState({ check_in: "", check_out: "" });

  useEffect(() => {
    const clickGetReservation = async () => {
      try {
        const data = await getReservationIdRequest(reservation_ID);
        const hotel = await getHotelIdRequest(data.hotel_ID);
        setReservationData({
          ...data,
          check_in: transformDateZ(data.check_in),
          check_out: transformDateZ(data.check_out),
          hotelPrice_per_night: hotel.price_per_night,
          hotelName: hotel.name,
        });
        reset({
          ...data,
          check_in: transformDateZ(data.check_in),
          check_out: transformDateZ(data.check_out),
        });
        console.log(data);
        console.log(hotel);
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
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const handleClick = handleSubmit((data) => {
    try {
      data = {
        check_in: transformDateZ(data.check_in),
        check_out: transformDateZ(data.check_out),
        hotel_ID: data.hotel_ID,
        ...guestsAndRoomType,
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
      <form className="update-reservation-form col s12" onSubmit={handleClick}>
        <h3 className="center-title">Update Reservation</h3>
        <h3 className="center-title">"{reservationData.hotelName}"</h3>
        <div className="container-errors">
          {typeof error === "string" ? <div className="error">{error}</div> : <div></div>}
        </div>
        <div className="row">
          <div className="input-field col s6">
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
            price_per_night={reservationData.hotelPrice_per_night}
            itsReserved={reservationData.room_type}
          />
          <ReservationOption
            guests={2}
            room_type={"Doble"}
            price_per_night={reservationData.hotelPrice_per_night}
            itsReserved={reservationData.room_type}
          />
          <ReservationOption
            guests={3}
            room_type={"Triple"}
            price_per_night={reservationData.hotelPrice_per_night}
            itsReserved={reservationData.room_type}
          />
          <ReservationOption
            guests={5}
            room_type={"Familiar"}
            price_per_night={reservationData.hotelPrice_per_night}
            itsReserved={reservationData.room_type}
          />
        </div>
      </form>
    </>
  );
}

export default UpdateReservation;
