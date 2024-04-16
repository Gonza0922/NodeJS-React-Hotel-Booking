import { useNavigate } from "react-router-dom";
import { getUserIdRequest } from "../api/user.api.js";
import { usePartnerContext } from "../context/PartnerContext";

const Element = ({ reserved, hotel_ID }) => {
  const { setUsers, showReservationsNumber } = usePartnerContext();

  const navigate = useNavigate();

  const clickGetUser = async () => {
    showReservationsNumber(hotel_ID);
    const data = await getUserIdRequest(reserved.user_ID);
    setUsers(data);
    navigate(`reservation/${hotel_ID}`);
  };

  const handleClick = async () => {
    showReservationsNumber(hotel_ID);
    const hotelDataArray = [];
    for (const reserve of reserved) {
      const data = await getUserIdRequest(reserve.user_ID);
      hotelDataArray.push(data);
    }
    setUsers(hotelDataArray);
    navigate(`reservation/${hotel_ID}`);
  };

  return (
    <>
      <div>
        {reserved === undefined ? (
          <div className="container-who-reserved">
            <h5>There´s not Reservations</h5>
          </div>
        ) : reserved.length > 1 ? (
          <div className="container-who-reserved">
            <h5>There´s {reserved.length} Reservations</h5>
            <button
              onClick={handleClick}
              className="btn-who-reserved waves-effect waves-light btn teal lighten-1"
            >
              Who reserved? {"=>"}
            </button>
          </div>
        ) : (
          <div className="container-who-reserved">
            <h5>There´s 1 Reservation</h5>
            <button
              onClick={clickGetUser}
              className="btn-who-reserved waves-effect waves-light btn teal lighten-1"
            >
              Who reserved? {"=>"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Element;
