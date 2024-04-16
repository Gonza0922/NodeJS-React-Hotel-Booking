import { useEffect } from "react";
import { ResetDate } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelIdRequest } from "../api/hotels.api.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { deleteReservationRequest } from "../api/reservations.api.js";

function WhoReserved() {
  const { logout, partner, reserved, setReserved, users } = usePartnerContext();
  const { hotel, setHotel, setRedirect, setErrorRedirect } = useHotelContext();
  const { hotel_ID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (reserved.length === 0) {
      navigate(`/partners/${partner.first_name}`);
    }
  }, [reserved, navigate, partner]);

  useEffect(() => {
    const clickGetHotelId = async () => {
      try {
        const data = await getHotelIdRequest(hotel_ID);
        setHotel(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetHotelId();
  }, []);

  const deleteReservation = async (id) => {
    await deleteReservationRequest(id);
    setReserved(reserved.filter((reserve) => reserve.reservation_ID !== id));
  };

  return (
    <>
      <NavbarMenu
        navigation={`/partners/${partner.first_name}`}
        profile={partner}
        logout={logout}
      />
      <h4 className="title">Who Reserved?</h4>
      <h4 className="title">{hotel.name}</h4>
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
                  <h1>Error</h1>
                )}
                <hr />
                <div className="container-data">
                  <h6>Reservation Date:</h6>{" "}
                  {ResetDate(reserved.reservation_date)}
                </div>
                <div className="container-data">
                  <h6>Check In:</h6> {ResetDate(reserved.check_in)}
                </div>
                <div className="container-data">
                  <h6>Check Out:</h6> {ResetDate(reserved.check_out)}
                </div>
                <div className="container-data">
                  <h6>Nights:</h6> {reserved.nights}
                </div>
                <div className="container-data">
                  <h6>People:</h6> {reserved.people}
                </div>
                <div className="container-data">
                  <h6>Room Type:</h6> {reserved.room_type}
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
                    <h1>Error</h1>
                  )}
                  <hr />
                  <div className="container-data">
                    <h6>Reservation Date:</h6>{" "}
                    {ResetDate(reserve.reservation_date)}
                  </div>
                  <div className="container-data">
                    <h6>Check In:</h6> {ResetDate(reserve.check_in)}
                  </div>
                  <div className="container-data">
                    <h6>Check Out:</h6> {ResetDate(reserve.check_out)}
                  </div>
                  <div className="container-data">
                    <h6>Nights:</h6> {reserve.nights}
                  </div>
                  <div className="container-data">
                    <h6>People:</h6> {reserve.people}
                  </div>
                  <div className="container-data">
                    <h6>Room Type:</h6> {reserve.room_type}
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
          <h1>Error</h1>
        )}
      </div>
    </>
  );
}

export default WhoReserved;
