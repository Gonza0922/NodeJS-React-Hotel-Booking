import { useEffect } from "react";
import { resetDate } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getHotelIdRequest } from "../api/hotel.api.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { deleteReservationRequest } from "../api/reservation.api.js";

function WhoReserved() {
  const { logout, partner, reserved, setReserved, users, showReservationsNumber } =
    usePartnerContext();
  const { hotel, setHotel, setRedirect, setErrorRedirect } = useHotelContext();
  const { hotel_ID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (reserved && reserved.length === 0) navigate(`/partners/${partner.first_name}`);
  }, [reserved, navigate, partner]);

  useEffect(() => {
    const clickGetHotelId = async () => {
      try {
        const data = await getHotelIdRequest(hotel_ID);
        setHotel(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
        console.log(error);
      }
    };
    clickGetHotelId();
  }, []);

  const deleteReservation = async (id) => {
    await deleteReservationRequest(id);
    typeof reserved === "object" && !Array.isArray(reserved)
      ? setReserved([])
      : setReserved(reserved.filter((reserve) => reserve.reservation_ID !== id));
  };

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <h3 className="title">Clients who reserved at {hotel.name}</h3>
      <div>
        {typeof reserved === "object" && !Array.isArray(reserved) ? (
          <div className="container-components">
            <div id="who-reserved" className="card who-reserved">
              <div className="component-who-reserved">
                {typeof users === "object" && !Array.isArray(users) ? (
                  <h5 className="name">
                    {users.first_name} {users.last_name}
                  </h5>
                ) : Array.isArray(users) ? (
                  <h5>Hay mas de 1 usuario</h5>
                ) : (
                  <Navigate to={`/partners/${partner.first_name}`} replace />
                )}
                <hr />
                <div className="container-data">
                  <h6>Reservation Date:</h6> {resetDate(reserved.reservation_date)}
                </div>
                <div className="container-data">
                  <h6>Check In:</h6> {resetDate(reserved.check_in)}
                </div>
                <div className="container-data">
                  <h6>Check Out:</h6> {resetDate(reserved.check_out)}
                </div>
                <div className="container-data">
                  <h6>Nights:</h6> {reserved.nights}
                </div>
                <div className="container-data">
                  <h6>Guests:</h6> {reserved.guests}
                </div>
                <div className="container-data">
                  <h6>Room Type:</h6> {reserved.room_type}
                </div>
                <div className="container-data">
                  <h6>Person Price:</h6> ${reserved.person_price}
                </div>
                <div className="container-data">
                  <h6>Total Price:</h6> ${reserved.total_price}
                </div>
                <button
                  onClick={() => deleteReservation(reserved.reservation_ID)}
                  className="button-decline waves-effect waves-light btn red darken-2"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ) : Array.isArray(reserved) ? (
          <div className="container-components">
            {reserved.map((reserve, index) => (
              <div id="who-reserved" className="card" key={index}>
                <div className="component-who-reserved">
                  {typeof users === "object" && !Array.isArray(users) ? (
                    <h5 className="name">
                      {users.first_name} {users.last_name}
                    </h5>
                  ) : Array.isArray(users) ? (
                    <h5 key={index} className="name">
                      {users[index].first_name} {users[index].last_name}
                    </h5>
                  ) : (
                    <Navigate to={`/partners/${partner.first_name}`} replace />
                  )}
                  <hr />
                  <div className="container-data">
                    <h6>Reservation Date:</h6> {resetDate(reserve.reservation_date)}
                  </div>
                  <div className="container-data">
                    <h6>Check In:</h6> {resetDate(reserve.check_in)}
                  </div>
                  <div className="container-data">
                    <h6>Check Out:</h6> {resetDate(reserve.check_out)}
                  </div>
                  <div className="container-data">
                    <h6>Nights:</h6> {reserve.nights}
                  </div>
                  <div className="container-data">
                    <h6>Guests:</h6> {reserve.guests}
                  </div>
                  <div className="container-data">
                    <h6>Room Type:</h6> {reserve.room_type}
                  </div>
                  <div className="container-data">
                    <h6>Person Price:</h6> ${reserve.person_price}
                  </div>
                  <div className="container-data">
                    <h6>Total Price:</h6> ${reserve.total_price}
                  </div>
                  <button
                    onClick={() => deleteReservation(reserve.reservation_ID)}
                    className="button-decline waves-effect waves-light btn red darken-2"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Navigate to={`/partners/${partner.first_name}`} replace />
        )}
      </div>
    </>
  );
}

export default WhoReserved;
