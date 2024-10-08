import { usePartnerContext } from "../context/PartnerContext";
import { useEffect } from "react";
import { getHotelPartnerRequest, deleteHotelRequest } from "../api/hotel.api";
import { useHotelContext } from "../context/HotelContext.jsx";
import { getReservationFromHotelRequest } from "../api/reservation.api.js";
import Element from "../components/Element.jsx";
import { useNavigate } from "react-router-dom";
import DeleteConfirm from "../components/DeleteConfirm.jsx";
import { MyLogoutIcon, MyPasswordIcon, MyPersonIcon } from "../components/Icons.jsx";

const Partners = () => {
  const { hotels, setHotels, setRedirect, setErrorRedirect } = useHotelContext();
  const {
    logout,
    partner,
    bookings,
    setBookings,
    error,
    setError,
    elementView,
    setElementView,
    styles,
    setStyles,
    showReservationsNumber,
  } = usePartnerContext();

  const navigate = useNavigate();

  useEffect(() => {
    M.AutoInit();
    const clickGetHotels = async () => {
      try {
        const data = await getHotelPartnerRequest();
        setHotels(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetHotels();
  }, []);

  const bookingsView = (hotel) => {
    const clickGetReserved = async () => {
      try {
        const data = await getReservationFromHotelRequest(hotel.hotel_ID);
        setBookings([]);
        if (data.length > 1) {
          data.forEach((element) => {
            setBookings((prevUsers) => [...prevUsers, element]);
          });
        } else {
          setBookings(data[0]);
        }
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetReserved();
  };

  const deleteHotel = async (id) => {
    try {
      await deleteHotelRequest(id);
      console.log("Hotel eliminado correctamente");
      setHotels(hotels.filter((hotel) => hotel.hotel_ID !== id));
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
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
      <nav className="nav-wrapper">
        <a
          className="hotelscom-logo"
          onClick={() => {
            navigate("/");
            showReservationsNumber(null);
          }}
        >
          Hotels.com
        </a>
        <ul className="nav-wrapper_ul">
          <li>
            <button
              className="nav-buttons"
              onClick={() => navigate(`/partners/${partner.first_name}/create`)}
            >
              Register Hotel
            </button>
          </li>
          <li>
            <a className="dropdown-trigger" href="#!" data-target="dropdown1">
              <div className="logo-initial">{partner.first_name.split("")[0]}</div>
              {partner.first_name} {partner.last_name}
            </a>
          </li>
          <ul id="dropdown1" className="dropdown-content">
            <li>
              <MyPersonIcon />
              <a onClick={() => navigate(`/partners/${partner.first_name}/profile`)}>
                Manage Profile
              </a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <MyPasswordIcon />
              <a onClick={() => navigate(`/partners/${partner.first_name}/password`)}>Password</a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <MyLogoutIcon />
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </ul>
      </nav>
      <h3 className="title">My Hotels</h3>
      <p className="p-down-title">Manage your Published Hotels</p>
      {hotels.length === 0 ? (
        <div className="no-reservations">
          <h4>There Are No Hotels...</h4>
          <button
            onClick={() => navigate(`/partners/${partner.first_name}/create`)}
            className="common-button"
          >
            Start registering your hotel
          </button>
        </div>
      ) : (
        hotels.map((hotel, index) => (
          <div key={index} className="hotel-and-who-reserved">
            <div id="partners-card" className="card">
              <div className="card-content">
                <span className="card-title">{hotel.name}</span>
                <h5>${hotel.price_per_night}</h5>
                <p>{hotel.description}</p>
                <h6>{hotel.services}</h6>
                <h6>{hotel.location}</h6>
                <h6 className="phone">{hotel.phone}</h6>
                <button
                  onClick={() => {
                    showReservationsNumber(hotel.hotel_ID);
                    bookingsView(hotel);
                  }}
                  className="buttons-right"
                >
                  Reservations
                </button>
                <button
                  onClick={() => navigate(`update/${hotel.hotel_ID}`)}
                  className="buttons-right"
                >
                  Edit
                </button>
                <button
                  onClick={() => showConfirmDelete(hotel.hotel_ID)}
                  className="buttons-right-delete"
                >
                  Delete
                </button>
              </div>
            </div>
            <div id="select-who-reserved-card" className="card">
              {hotel.hotel_ID === elementView.reservationsNumber && (
                <Element bookings={bookings} hotel_ID={hotel.hotel_ID} />
              )}
            </div>
            {hotel.hotel_ID === elementView.confirmDelete && (
              <DeleteConfirm
                text={`If you delete the hotel "${hotel.name}", its reservations will also be deleted.`}
                id={hotel.hotel_ID}
                showConfirmDelete={showConfirmDelete}
                deleteReservation={deleteHotel}
                buttonName={"Delete"}
                toastText={`"${hotel.name}" deleted`}
              />
            )}
          </div>
        ))
      )}
      <div>
        {error === "You can delete the Hotel because it has reservations" && (
          <div className="delete-confirm-container">
            <div className="delete-confirm-hotelError">
              <h5>{error}</h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Partners;
