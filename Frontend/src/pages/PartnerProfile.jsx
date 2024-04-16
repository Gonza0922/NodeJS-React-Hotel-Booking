import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "../context/PartnerContext";
import {
  getPartnerIdRequest,
  putPartnerIdRequest,
  deletePartnerRequest,
} from "../api/partner.api";
import { useHotelContext } from "../context/HotelContext";

function PartnerProfile() {
  const { logout, partner, error, setError, confirmDelete, setConfirmDelete } =
    usePartnerContext();
  const { setRedirect, setErrorRedirect, load, setLoad } = useHotelContext();
  const navigate = useNavigate();
  const [partnerData, setPartnerData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    DNI: "",
    phone: "",
  });

  useEffect(() => {
    M.AutoInit();
    setLoad("Update Profile");
    const clickGetUser = async () => {
      try {
        const data = await getPartnerIdRequest(partner.partner_ID);
        setPartnerData({ ...data, password: "" });
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetUser();
  }, []);

  const updatePartner = async () => {
    try {
      const data = await putPartnerIdRequest({
        ...partnerData,
        DNI: Number(partnerData.DNI),
        phone: Number(partnerData.phone),
      });
      setLoad("Updating Profile...");
      setTimeout(() => {
        navigate(`/partners/${partner.first_name}`);
        setLoad("Update Profile");
      }, 3000);
      return data;
    } catch (error) {
      console.log(error);
      setError(error.response.data.message[0]);
    }
  };

  const deletePartner = async () => {
    try {
      const data = await deletePartnerRequest(partner.partner_ID);
      console.log(data);
      window.location.reload();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updatePartner();
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper deep-orange lighten-2">
          <a className="brand-logo left" onClick={() => navigate("/")}>
            Hotels.com
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <a
                className="waves-effect waves-light btn red darken-2"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Profile
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
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3>Update Profile</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={partnerData.email}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setPartnerData({ ...partnerData, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              value={partnerData.first_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setPartnerData({ ...partnerData, first_name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              value={partnerData.last_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setPartnerData({ ...partnerData, last_name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="DNI">DNI</label>
            <input
              id="DNI"
              type="number"
              value={partnerData.DNI}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setPartnerData({ ...partnerData, DNI: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="number"
              value={partnerData.phone}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setPartnerData({ ...partnerData, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="container-button-login-register-partner">
          <button type="submit" className="waves-effect waves-light btn">
            {load}
          </button>
        </div>
      </form>
      {confirmDelete && (
        <div className="delete-confirm-container">
          <div className="delete-confirm">
            <h5>
              If you delete your profile, your hotels and their reservations
              will also be deleted.
            </h5>
            <div className="container-button-delete-confirm">
              <button
                onClick={() => setConfirmDelete(false)}
                className="button-delete-confirm waves-effect waves-light btn blue darken-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePartner();
                  setConfirmDelete(false);
                }}
                className="button-delete-confirm waves-effect waves-light btn red darken-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PartnerProfile;
