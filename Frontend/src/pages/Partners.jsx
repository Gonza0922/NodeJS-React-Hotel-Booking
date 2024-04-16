import { usePartnerContext } from "../context/PartnerContext";
import { useEffect } from "react";
import { getHotelPartnerRequest, deleteHotelRequest } from "../api/hotels.api";
import { useHotelContext } from "../context/HotelContext.jsx";
import { getReservationFromHotelRequest } from "../api/reservations.api.js";
import {
  deleteImageRequest,
  deleteArrayImagesRequest,
} from "../api/images.api.js";
import Element from "../components/Element.jsx";
import { useNavigate } from "react-router-dom";

const Partners = () => {
  const { hotels, setHotels, setRedirect, setErrorRedirect } =
    useHotelContext();
  const {
    logout,
    partner,
    reserved,
    setReserved,
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

  const reservedView = (hotel) => {
    const clickGetReserved = async () => {
      try {
        const data = await getReservationFromHotelRequest(hotel.hotel_ID);
        setReserved([]);
        if (data.length > 1) {
          data.forEach((element) => {
            setReserved((prevUsers) => [...prevUsers, element]);
          });
        } else {
          setReserved(data[0]);
        }
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetReserved();
  };

  const updateHotel = async (id) => {
    navigate(`update/${id}`);
  };

  const deleteMoreImages = async (id) => {
    try {
      const data = await deleteArrayImagesRequest(id);
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const deletePrincipal = async (id) => {
    try {
      const data = await deleteImageRequest(id);
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const deleteHotel = async (id) => {
    try {
      await deleteHotelRequest(id);
      console.log("Hotel eliminado correctamente");
      setHotels(hotels.filter((hotel) => hotel.hotel_ID !== id));
    } catch (error) {
      console.log(error);
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
    <div className="alfa">
      <nav>
        <div className="nav-wrapper deep-orange lighten-2">
          <a
            className="brand-logo left"
            onClick={() => {
              navigate("/");
              showReservationsNumber(null);
            }}
          >
            Hotels.com
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <a
                className="waves-effect waves-light btn"
                onClick={() =>
                  navigate(`/partners/${partner.first_name}/create`)
                }
              >
                Register Hotel
              </a>
            </li>
            <li>
              <a className="dropdown-trigger" href="#!" data-target="dropdown1">
                {partner.first_name}
                <i className="material-icons right">arrow_drop_down</i>
              </a>
            </li>
            <ul id="dropdown1" className="dropdown-content">
              <li>
                <a
                  onClick={() =>
                    navigate(`/partners/${partner.first_name}/profile`)
                  }
                >
                  Profile Data
                </a>
              </li>
              <li className="divider" tabIndex="-1"></li>
              <li>
                <a
                  onClick={() =>
                    navigate(`/partners/${partner.first_name}/password`)
                  }
                >
                  Change Password
                </a>
              </li>
              <li className="divider" tabIndex="-1"></li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </ul>
        </div>
      </nav>
      <h3 className="title">My Hotels</h3>
      {hotels.length === 0 ? (
        <div className="no-reservations">
          <h4>THERE ARE NO HOTELS...</h4>
          <button
            onClick={() => navigate(`/partners/${partner.first_name}/create`)}
            className="waves-effect waves-light btn"
          >
            Start registering your hotel
          </button>
        </div>
      ) : (
        hotels.map((hotel, index) => (
          <div key={index} className="hotel-and-who-reserved">
            <div id="card-partners" className="card">
              <div className="card-content">
                <span className="card-title">{hotel.name}</span>
                <h5>${hotel.price_per_night}.00</h5>
                <p>{hotel.description}</p>
                <h6>{hotel.services}</h6>
                <h6>{hotel.location}</h6>
                <h6 className="phone">{hotel.phone}</h6>
                <button
                  onClick={() => {
                    showReservationsNumber(hotel.hotel_ID);
                    reservedView(hotel);
                  }}
                  className="reservations waves-effect waves-light btn teal lighten-1"
                >
                  Reservations
                </button>
                <button
                  onClick={() => updateHotel(hotel.hotel_ID)}
                  className="delete-hotel waves-effect waves-light btn teal lighten-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => showConfirmDelete(hotel.hotel_ID)}
                  className="delete-hotel waves-effect waves-light btn red darken-2"
                >
                  Delete
                </button>
              </div>
            </div>
            <div id="who-reserved" className="card">
              {hotel.hotel_ID === elementView.reservationsNumber && (
                <Element reserved={reserved} hotel_ID={hotel.hotel_ID} />
              )}
            </div>
            {hotel.hotel_ID === elementView.confirmDelete && (
              <div className="delete-confirm-container">
                <div className="delete-confirm">
                  <h5>
                    If you delete the hotel, its reservations will also be
                    deleted.
                  </h5>
                  <div className="container-button-delete-confirm">
                    <button
                      onClick={() => showConfirmDelete(hotel.hotel_ID)}
                      className="button-delete-confirm waves-effect waves-light btn blue darken-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteMoreImages(hotel.hotel_ID);
                        deletePrincipal(hotel.hotel_ID);
                        deleteHotel(hotel.hotel_ID);
                        showConfirmDelete(hotel.hotel_ID);
                      }}
                      className="button-delete-confirm waves-effect waves-light btn red darken-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default Partners;
