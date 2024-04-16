import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbars/Navbar.jsx";
import NavbarUser from "../components/Navbars/NavbarUser.jsx";
import { useUserContext } from "../context/UserContext";
import { useHotelContext } from "../context/HotelContext.jsx";
import { getAllHotelsRequest } from "../api/hotels.api";

function Home() {
  const { isAuthenticated, user } = useUserContext();
  const { hotels, setHotels, setRedirect, setErrorRedirect } =
    useHotelContext();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const clickGetHotels = async () => {
      try {
        const data = await getAllHotelsRequest();
        setHotels(data);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetHotels();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/users/${user.first_name}`);
    }
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated ? <Navbar /> : <NavbarUser />}
      <div className="row">
        {hotels.length < 1 ? (
          <h1 className="hotel-not-found">HOTEL NOT FOUND</h1>
        ) : (
          hotels.map((hotel, index) => (
            <div key={index} className="col s12 m10">
              <div
                id="card"
                className="card"
                onClick={() => {
                  navigate(`/hotel/${hotel.hotel_ID}`);
                }}
              >
                <div className="card-image">
                  <img id="img" src={hotel.principalImg} />
                </div>
                <div className="card-content">
                  <span className="card-title">{hotel.name}</span>
                  <a className="btn-floating halfway-fab waves-effect waves-light">
                    View
                  </a>
                  <h5>${hotel.price_per_night}</h5>
                  <p>{hotel.description}</p>
                  <h6>{hotel.location}</h6>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
