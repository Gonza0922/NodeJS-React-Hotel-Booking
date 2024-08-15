import { useNavigate } from "react-router-dom";
import { getUserIdRequest } from "../api/user.api.js";
import { usePartnerContext } from "../context/PartnerContext";

const Element = ({ bookings, hotel_ID }) => {
  const { setUsers, showReservationsNumber } = usePartnerContext();

  const navigate = useNavigate();

  const clickGetUser = async () => {
    showReservationsNumber(hotel_ID);
    const data = await getUserIdRequest(bookings.user_ID);
    setUsers(data);
    navigate(`reservation/${hotel_ID}`);
  };

  const handleClick = async () => {
    showReservationsNumber(hotel_ID);
    const hotelDataArray = [];
    for (const reserve of bookings) {
      const data = await getUserIdRequest(reserve.user_ID);
      hotelDataArray.push(data);
    }
    setUsers(hotelDataArray);
    navigate(`reservation/${hotel_ID}`);
  };

  return (
    <>
      <div>
        {bookings === undefined ? (
          <div className="container-select-who-reserved-card">
            <h5>There´s not Reservations</h5>
          </div>
        ) : bookings.length > 1 ? (
          <div className="container-select-who-reserved-card">
            <h5>There´s {bookings.length} Reservations</h5>
            <button onClick={handleClick} className="common-button">
              Who reserved? {"=>"}
            </button>
          </div>
        ) : typeof bookings === "object" ? (
          <div className="container-select-who-reserved-card">
            <h5>There´s 1 Reservation</h5>
            <button onClick={clickGetUser} className="common-button">
              Who reserved? {"=>"}
            </button>
          </div>
        ) : (
          <h1>Error in Element</h1>
        )}
      </div>
    </>
  );
};

export default Element;
