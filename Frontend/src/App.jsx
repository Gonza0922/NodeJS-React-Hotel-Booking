import { BrowserRouter, Routes, Route } from "react-router-dom";
import PartnerProvider from "./context/PartnerContext.jsx";
import HotelProvider from "./context/HotelContext.jsx";
import UserProvider from "./context/UserContext.jsx";
import UserProtectedPages from "./components/UserProtectedPages.jsx";
import PartnerProtectedPages from "./components/PartnerProtectedPages.jsx";
import Home from "./pages/Home.jsx";
import Hotel from "./pages/Hotel.jsx";
import NotFound from "./pages/NotFound.jsx";
import Reservations from "./pages/Reservations.jsx";
import Login from "./pages/logins/Login.jsx";
import Register from "./pages/registers/Register.jsx";
import LoginProperty from "./pages/logins/LoginProperty.jsx";
import RegisterProperty from "./pages/registers/RegisterProperty.jsx";
import Partners from "./pages/Partners.jsx";
import CreateHotel from "./pages/CreateHotel.jsx";
import WhoReserved from "./pages/WhoReserved.jsx";
import UpdateHotel from "./pages/UpdateHotel.jsx";
import UpdateReservation from "./pages/UpdateReservation.jsx";
import Profile from "./pages/Profile.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import PartnerProfile from "./pages/PartnerProfile.jsx";
import UpdatePartnerPassword from "./pages/UpdatePartnerPassword.jsx";
import ErrorHandling from "./components/ErrorHandling.jsx";

function App() {
  return (
    <UserProvider>
      <HotelProvider>
        <PartnerProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ErrorHandling />}>
                <Route index element={<Home />} />
                <Route path="/hotel/:hotel_ID" element={<Hotel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/loginProperty" element={<LoginProperty />} />
                <Route
                  path="/registerProperty"
                  element={<RegisterProperty />}
                />
                <Route element={<UserProtectedPages />}>
                  <Route path="/users/:name" element={<Home />} />
                  <Route
                    path="/users/:name/reservations"
                    element={<Reservations />}
                  />
                  <Route
                    path="/users/:name/reservations/update/:reservation_ID"
                    element={<UpdateReservation />}
                  />
                  <Route path="/users/:name/profile" element={<Profile />} />
                  <Route
                    path="/users/:name/password"
                    element={<UpdatePassword />}
                  />
                </Route>
                <Route element={<PartnerProtectedPages />}>
                  <Route path="/partners/:name" element={<Partners />} />
                  <Route
                    path="/partners/:name/create"
                    element={<CreateHotel />}
                  />
                  <Route
                    path="/partners/:name/update/:hotel_ID"
                    element={<UpdateHotel />}
                  />
                  <Route
                    path="/partners/:name/reservation/:hotel_ID"
                    element={<WhoReserved />}
                  />
                  <Route
                    path="/partners/:name/profile"
                    element={<PartnerProfile />}
                  />
                  <Route
                    path="/partners/:name/password"
                    element={<UpdatePartnerPassword />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PartnerProvider>
      </HotelProvider>
    </UserProvider>
  );
}

export default App;
