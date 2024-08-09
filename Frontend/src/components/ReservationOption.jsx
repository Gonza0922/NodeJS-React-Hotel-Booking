import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useHotelContext } from "../context/HotelContext";

const ReservationOption = ({ guests, room_type, price_per_night, itsReserved }) => {
  const { isAuthenticated } = useUserContext();
  const { setGuestsAndRoomType } = useHotelContext();
  const navigate = useNavigate();

  const verify = () => {
    if (!isAuthenticated) return navigate("/login");
  };

  return (
    <div className="guests-and-roomType">
      <div>{guests} Guests</div>
      <div>Room Type: {room_type}</div>
      <div>Per Night: ${guests * price_per_night}</div>
      {itsReserved === room_type ? (
        <div className="waves-effect waves-light btn red darken-2">My Reservation</div>
      ) : (
        <button
          className="waves-effect waves-light btn"
          onClick={() => {
            verify();
            document.body.style.overflowY = "hidden";
            setGuestsAndRoomType({ guests, room_type });
          }}
        >
          Reserve Now
        </button>
      )}
    </div>
  );
};

export default ReservationOption;
