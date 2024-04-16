import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReservationIdRequest,
  putReservationRequest,
} from "../api/reservations.api";
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
    people: "",
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
        setErrorRedirect(true);
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
      setError(error.response.data.message);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log(reservationData);
    updateReservation(reservationData);
  };

  return (
    <>
      <NavbarMenu
        navigation={`/users/${user.first_name}`}
        profile={user}
        logout={logout}
      />
      <form className="form-update-reservation col s12" onSubmit={handleClick}>
        <h3 className="title">Update Reservation {reservation_ID}</h3>
        <div className="container-errors">
          {error === "Reservation already exists" ? (
            <div className="error">{error}</div>
          ) : error === "Fields are required" ? (
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
          <div className="col s6">
            <label htmlFor="people">People</label>
            <input
              id="people"
              type="number"
              value={reservationData.people}
              className="validate"
              autoComplete="off"
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  people: e.target.value,
                })
              }
            />
          </div>
          <div className="input-field col s6">
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
              <option value="individual">Individual</option>
              <option value="familiar">Familiar</option>
              <option value="doble">Doble</option>
              {/* <option value="suite">Suite + $50</option> */}
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
