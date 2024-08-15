import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbars/Navbar.jsx";
import NavbarUser from "../components/Navbars/NavbarUser.jsx";
import { useUserContext } from "../context/UserContext";
import { useHotelContext } from "../context/HotelContext.jsx";
import TruncateText from "../components/TruncateText.jsx";

function Home() {
  const { isAuthenticated, user } = useUserContext();
  const { hotels } = useHotelContext();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/users/${user.first_name}`);
    }
  }, [isAuthenticated]);

  return (
    <>
      {!isAuthenticated ? <Navbar /> : <NavbarUser />}
      <div className="container-home-cards">
        {hotels.length < 1 ? (
          <h1 className="hotel-not-found">Hotel Not Found...</h1>
        ) : (
          hotels.map((hotel, index) => (
            <div key={index} className="col s12 m10">
              <div
                id="home-card"
                className="card"
                onClick={() => {
                  navigate(`/hotel/${hotel.hotel_ID}`);
                }}
              >
                <div className="card-image">
                  <img
                    id="img"
                    src={
                      hotel.principalImg ? hotel.principalImg : import.meta.env.VITE_NONE_IMAGE
                    }
                  />
                </div>
                <div className="card-content">
                  <span className="card-title">{hotel.name}</span>
                  <button className="button-view">View</button>
                  <h5>${hotel.price_per_night}</h5>
                  <TruncateText text={hotel.description} maxLength={200} />
                  <h6>{hotel.location}</h6>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Home;
