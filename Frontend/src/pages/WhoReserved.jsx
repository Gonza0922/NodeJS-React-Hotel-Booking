import { useEffect } from "react";
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
    if (typeof bookings === "object" && !Array.isArray(bookings)) setBookings([bookings]);
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

  const tableColums = [
    "Reservation ID",
    "Customer",
    "Room",
    "Date",
    "Check In",
    "Nights",
    "Guests",
    "Person Price",
    "Total Price",
    "Decline",
  ];

  return (
    <>
      <NavbarMenu navigation={"partners"} profile={partner} logout={logout} />
      <main>
        <h3 className="title">Clients who reserved at {hotel.name}</h3>
        <p className="p-down-title">Manage your Hotel Reservations</p>
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
            {Array.isArray(bookings) && bookings.length > 0 ? (
              <tbody>
                {bookings.map((reserve, index) => (
                  <tr key={index} className="body-tr">
                    <td className="body-td">{reserve.reservation_ID}</td>
                    <td className="body-td">
                      {users.first_name} {users.last_name}
                    </td>
                    <td className="body-td">{reserve.room_type} room</td>
                    <td className="body-td">{resetDate(reserve.reservation_date)}</td>
                    <td className="body-td">{resetDate(reserve.check_in)}</td>
                    <td className="body-td">{reserve.nights} nights</td>
                    <td className="body-td">{reserve.guests} guests</td>
                    <td className="body-td">${reserve.person_price}</td>
                    <td className="body-td">${reserve.total_price}</td>
                    <td>
                      <button
                        className="body-td_delete-button"
                        onClick={() => {
                          setIdToDelete(reserve.reservation_ID);
                          showConfirmDelete(reserve.reservation_ID);
                        }}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : !bookings ? (
              <Navigate to={`/partners/${partner.first_name}`} replace />
            ) : (
              <></>
            )}
          </table>
        </div>
        {idToDelete && idToDelete === elementView.confirmDelete ? (
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
      </main>
    </>
  );
}

export default WhoReserved;
