import { getReservationRequest, deleteReservationRequest } from "../api/reservation.api";
import { getHotelIdRequest } from "../api/hotel.api";
import { useEffect, useState } from "react";
import { resetDate } from "../functions/dates.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import DeleteConfirm from "../components/DeleteConfirm.jsx";

function Reservations() {
  const { reservations, setReservations, setRedirect, setErrorRedirect } = useHotelContext();
  const { logout, user } = useUserContext();
  const { elementView, setElementView, styles, setStyles } = usePartnerContext();
  const [reservationHotel, setReservationHotel] = useState([]);

  useEffect(() => {
    const clickGetReservations = async () => {
      try {
        const data = await getReservationRequest();
        setReservations(data);
        const hotelDataArray = [];
        for (const reservation of data) {
          const hotelData = await getHotelIdRequest(reservation.hotel_ID);
          hotelDataArray.push(hotelData);
        }
        setReservationHotel(hotelDataArray);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetReservations();
  }, []);

  const navigate = useNavigate();

  const deleteReservation = async (id) => {
    await deleteReservationRequest(id);
    setReservations(reservations.filter((reservation) => reservation.reservation_ID !== id));
  };

  const showConfirmDelete = (id) => {
    setStyles((prevStyles) => !prevStyles);
    document.body.style.overflowY = styles ? "auto" : "hidden";
    setElementView((prevElement) => ({
      ...prevElement,
      confirmDelete: id === elementView.confirmDelete ? null : id,
    }));
  };

  return (
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <h3 className="title">My Reservations</h3>
      <p className="p-down-title">Manage Hotels Reservations</p>
      {reservations.length === 0 ? (
        <div className="no-reservations">
          <h4>THERE ARE NO RESERVATIONS...</h4>
          <button onClick={() => navigate("/login")} className="common-button">
            Start by making a reservation
          </button>
        </div>
      ) : (
        reservations.map((reservation, index) => (
          <div key={index} className="hotel-and-who-reserved">
            <div id="reservations-card" className="card">
              <div className="card-content">
                <span className="reservation-reservation_id">
                  Reservation_ID: {reservation.reservation_ID}
                </span>
                <h6>Reservation Date: {resetDate(reservation.reservation_date)}</h6>
                <h5>Check In: {resetDate(reservation.check_in)}</h5>
                <h5>Check Out: {resetDate(reservation.check_out)}</h5>
                <h6>Nights: {reservation.nights}</h6>
                <h6>Guests: {reservation.guests}</h6>
                <h6>Room Type: {reservation.room_type}</h6>
                <h6>Person Price: ${reservation.person_price}</h6>
                <h6>Total Price: ${reservation.total_price}</h6>
                {reservationHotel < 1 ? (
                  <p></p>
                ) : (
                  <span id="reservations-title" className="card-title">
                    {reservationHotel[index].name}
                  </span>
                )}
                <button
                  onClick={() => showConfirmDelete(reservation.reservation_ID)}
                  className="buttons-right-delete"
                >
                  Delete Reservation
                </button>
                <button
                  onClick={() => navigate(`update/${reservation.reservation_ID}`)}
                  className="buttons-right"
                >
                  Edit Reservation
                </button>
              </div>
            </div>
            {reservation.reservation_ID === elementView.confirmDelete && (
              <DeleteConfirm
                text={`Delete reservation ${reservation.reservation_ID}?`}
                id={reservation.reservation_ID}
                showConfirmDelete={showConfirmDelete}
                deleteReservation={deleteReservation}
                buttonName={"Delete"}
                toastText={`Reservation ${reservation.reservation_ID} deleted`}
              />
            )}
          </div>
        ))
      )}
    </>
  );
}

export default Reservations;
