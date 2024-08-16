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
import LoginPartner from "./pages/logins/LoginPartner.jsx";
import RegisterPartner from "./pages/registers/RegisterPartner.jsx";
import Partners from "./pages/Partners.jsx";
import CreateHotel from "./pages/CreateHotel.jsx";
import WhoReserved from "./pages/WhoReserved.jsx";
import UpdateHotel from "./pages/UpdateHotel.jsx";
import UpdateReservation from "./pages/UpdateReservation.jsx";
import UpdateUserProfile from "./pages/UpdateUserProfile.jsx";
import UpdateUserPassword from "./pages/UpdateUserPassword.jsx";
import UpdatePartnerProfile from "./pages/UpdatePartnerProfile.jsx";
import UpdatePartnerPassword from "./pages/UpdatePartnerPassword.jsx";
import ErrorHandling from "./components/ErrorHandling.jsx";
import UserComments from "./pages/UserComments.jsx";
import LayoutWithFooter from "./components/LayoutWithFooter.jsx";

function MyRoutes() {
  return (
    <>
      <Routes>
        <Route element={<ErrorHandling />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/LoginPartner" element={<LoginPartner />} />
          <Route path="/RegisterPartner" element={<RegisterPartner />} />
          <Route element={<LayoutWithFooter />}>
            <Route index element={<Home />} />
            <Route path="/hotel/:hotel_ID" element={<Hotel />} />
            <Route element={<UserProtectedPages />}>
              <Route path="/users/:name" element={<Home />} />
              <Route path="/users/:name/reservations" element={<Reservations />} />
              <Route
                path="/users/:name/reservations/update/:reservation_ID"
                element={<UpdateReservation />}
              />
              <Route path="/users/:name/profile" element={<UpdateUserProfile />} />
              <Route path="/users/:name/password" element={<UpdateUserPassword />} />
              <Route path="/users/:name/reviews" element={<UserComments />} />
            </Route>
            <Route element={<PartnerProtectedPages />}>
              <Route path="/partners/:name" element={<Partners />} />
              <Route path="/partners/:name/create" element={<CreateHotel />} />
              <Route path="/partners/:name/update/:hotel_ID" element={<UpdateHotel />} />
              <Route path="/partners/:name/reservation/:hotel_ID" element={<WhoReserved />} />
              <Route path="/partners/:name/profile" element={<UpdatePartnerProfile />} />
              <Route path="/partners/:name/password" element={<UpdatePartnerPassword />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <HotelProvider>
        <PartnerProvider>
          <BrowserRouter>
            <MyRoutes />
          </BrowserRouter>
        </PartnerProvider>
      </HotelProvider>
    </UserProvider>
  );
}

export default App;
