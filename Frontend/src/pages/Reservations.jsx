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
  const {
    reservations,
    setReservations,
    setRedirect,
    setErrorRedirect,
    idToDelete,
    setIdToDelete,
  } = useHotelContext();
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

  const tableColums = [
    "Reservation ID",
    "Hotel",
    "Reservation Date",
    "Check In",
    "Nights",
    "Guests",
    "Person Price",
    "Total Price",
    "Edit",
    "Delete",
  ];

  return (
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <main>
        <h3 className="title">My Reservations</h3>
        <p className="p-down-title">Manage Hotels Reservations</p>
        <div className="my-reservations_container">
          <table className="my-reservations_table">
            <thead>
              <tr className="head-tr">
                {tableColums.map((colum, index) => (
                  <th key={index} className="head-th">
                    {colum}
                  </th>
                ))}
              </tr>
            </thead>
            {reservations.length > 0 ? (
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr key={index} className="body-tr">
                    <td className="body-td">{reservation.reservation_ID}</td>
                    <td className="body-td">
                      <b>{reservationHotel[index] && reservationHotel[index].name}</b>
                      <div> {reservation.room_type} room</div>
                    </td>
                    <td className="body-td">{resetDate(reservation.reservation_date)}</td>
                    <td className="body-td">{resetDate(reservation.check_in)}</td>
                    <td className="body-td">{reservation.nights} nights</td>
                    <td className="body-td">{reservation.guests} guests</td>
                    <td className="body-td">${reservation.person_price}</td>
                    <td className="body-td">${reservation.total_price}</td>
                    <td>
                      <button
                        className="body-td_edit-button"
                        onClick={() => navigate(`update/${reservation.reservation_ID}`)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="body-td">
                      <button
                        className="body-td_delete-button"
                        onClick={() => {
                          setIdToDelete(reservation.reservation_ID);
                          showConfirmDelete(reservation.reservation_ID);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <></>
            )}
          </table>
          {reservations.length === 0 ? (
            <div className="no-reservations">
              <h4>There Are No Reservations...</h4>
              <button onClick={() => navigate("/login")} className="common-button">
                Start by making a reservation
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        {idToDelete && idToDelete === elementView.confirmDelete && (
          <DeleteConfirm
            text={`Delete reservation ${idToDelete}?`}
            id={idToDelete}
            showConfirmDelete={showConfirmDelete}
            deleteReservation={deleteReservation}
            buttonName={"Delete"}
            toastText={`Reservation ${idToDelete} deleted`}
          />
        )}
      </main>
    </>
  );
}

export default Reservations;
