import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReservationIdRequest,
  putReservationRequest,
} from "../api/reservation.api";
import { transformDateZ } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useUserContext } from "../context/UserContext";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";

function UpdateReservation() {
  const { reservation_ID } = useParams();
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
      setError(error.response.data.message[0]);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log(reservationData);
    updateReservation(reservationData);
  };

  return (
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <form className="form-update-reservation col s12" onSubmit={handleClick}>
        <h3 className="title">Update Reservation {reservation_ID}</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
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
              value={transformDateZ(reservationData.check_in)}
              className="validate"
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  check_in: e.target.value,
                })
              }
            />
            <label htmlFor="check_in">Check In</label>
          </div>
          <div className="input-field col s6">
            <input
              id="check_out"
              type="date"
              value={transformDateZ(reservationData.check_out)}
              className="validate"
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  check_out: e.target.value,
                })
              }
            />
            <label htmlFor="check_out">Check Out</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <p className="p-update-reservation">Guests</p>
            <select
              className="browser-default"
              value={reservationData.guests}
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  guests: Number(e.target.value),
                })
              }
            >
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
          </div>
          <div className="input-field col s6">
            <p className="p-update-reservation">Room Type</p>
            <select
              className="browser-default"
              value={reservationData.room_type}
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  room_type: e.target.value,
                })
              }
            >
              <option value="" disabled>
                Room Type
              </option>
              <option value="Individual">Individual</option>
              <option value="Familiar">Familiar</option>
              <option value="Doble">Doble</option>
              {/* <option value="Suite">Suite + $50</option> */}
            </select>
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
