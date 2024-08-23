import { useEffect, useState } from "react";
import { resetDate } from "../functions/dates.js";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getHotelIdRequest } from "../api/hotel.api.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { deleteReservationRequest } from "../api/reservation.api.js";
import DeleteConfirm from "../components/DeleteConfirm.jsx";

function WhoReserved() {
  const {
    logout,
    partner,
    bookings,
    setBookings,
    users,
    elementView,
    setElementView,
    styles,
    setStyles,
  } = usePartnerContext();
  const { hotel, setHotel, setRedirect, setErrorRedirect, idToDelete, setIdToDelete } =
    useHotelContext();
  const { hotel_ID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (bookings && bookings.length === 0) navigate(`/partners/${partner.first_name}`);
  }, [bookings, navigate, partner]);

  useEffect(() => {
    const clickGetHotelId = async () => {
      try {
        const data = await getHotelIdRequest(hotel_ID);
        setHotel(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
        console.error(error);
      }
    };
    clickGetHotelId();
  }, []);

  const showConfirmDelete = (id) => {
    setStyles((prevStyles) => !prevStyles);
    document.body.style.overflowY = styles ? "auto" : "hidden";
    setElementView((prevElement) => ({
      ...prevElement,
      confirmDelete: id === elementView.confirmDelete ? null : id,
    }));
  };

  const deleteReservation = async (id) => {
    await deleteReservationRequest(id);
    typeof bookings === "object" && !Array.isArray(bookings)
      ? setBookings([])
      : setBookings(bookings.filter((reserve) => reserve.reservation_ID !== id));
  };

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <h3 className="title">Clients who reserved at {hotel.name}</h3>
      <p className="p-down-title">Manage your Hotel Reservations</p>
      <div>
        {typeof bookings === "object" && !Array.isArray(bookings) ? (
          <div className="container-who-reserved-card">
            <div id="who-reserved-card" className="card who-reserved">
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
              <div className="who-reserved-card_container-data">
                <h6>Reservation Date:</h6> {resetDate(bookings.reservation_date)}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Check In:</h6> {resetDate(bookings.check_in)}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Check Out:</h6> {resetDate(bookings.check_out)}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Nights:</h6> {bookings.nights}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Guests:</h6> {bookings.guests}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Room Type:</h6> {bookings.room_type}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Person Price:</h6> ${bookings.person_price}
              </div>
              <div className="who-reserved-card_container-data">
                <h6>Total Price:</h6> ${bookings.total_price}
              </div>
              <button
                onClick={() => showConfirmDelete(bookings.reservation_ID)}
                className="button-decline"
              >
                Decline
              </button>
            </div>
          </div>
        ) : Array.isArray(bookings) ? (
          <div className="container-who-reserved-card">
            {bookings.map((reserve, index) => (
              <div id="who-reserved-card" className="card" key={index}>
                <span className="who-reserved-reservation_id">
                  Reservation_ID: {reserve.reservation_ID}
                </span>
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
                <div className="who-reserved-card_container-data">
                  <h6>Reservation Date:</h6> {resetDate(reserve.reservation_date)}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Check In:</h6> {resetDate(reserve.check_in)}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Check Out:</h6> {resetDate(reserve.check_out)}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Nights:</h6> {reserve.nights}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Guests:</h6> {reserve.guests}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Room Type:</h6> {reserve.room_type}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Person Price:</h6> ${reserve.person_price}
                </div>
                <div className="who-reserved-card_container-data">
                  <h6>Total Price:</h6> ${reserve.total_price}
                </div>
                <button
                  onClick={() => {
                    setIdToDelete(reserve.reservation_ID);
                    showConfirmDelete(reserve.reservation_ID);
                  }}
                  className="button-decline"
                >
                  Decline
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Navigate to={`/partners/${partner.first_name}`} replace />
        )}
      </div>
      {bookings && bookings.reservation_ID === elementView.confirmDelete ? (
        <DeleteConfirm
          text={`Decline reservation ${bookings.reservation_ID}?`}
          id={bookings.reservation_ID}
          showConfirmDelete={showConfirmDelete}
          deleteReservation={deleteReservation}
          buttonName={"Decline"}
          toastText={`Reservation ${bookings.reservation_ID} declined`}
        />
      ) : idToDelete && idToDelete === elementView.confirmDelete ? (
        <DeleteConfirm
          text={`Decline reservation ${idToDelete}?`}
          id={idToDelete}
          showConfirmDelete={showConfirmDelete}
          deleteReservation={deleteReservation}
          buttonName={"Decline"}
          toastText={`Reservation ${idToDelete} declined`}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default WhoReserved;
