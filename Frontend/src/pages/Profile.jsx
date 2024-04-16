import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import {
  deleteUserRequest,
  getUserIdRequest,
  putUserIdRequest,
} from "../api/user.api";

function Profile() {
  const { logout, user, error, setError } = useUserContext();
  const { confirmDelete, setConfirmDelete } = usePartnerContext();
  const { setRedirect, setErrorRedirect } = useHotelContext();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    DNI: "",
    phone: "",
  });

  useEffect(() => {
    M.AutoInit();
    const clickGetUser = async () => {
      try {
        const data = await getUserIdRequest(user.user_ID);
        setUserData({ ...data, password: "" });
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetUser();
  }, []);

  const updateUser = async () => {
    try {
      const data = await putUserIdRequest(userData);
      console.log(data);
      navigate(`/users/${user.first_name}`);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const deleteUser = async () => {
    try {
      const data = await deleteUserRequest(user.user_ID);
      console.log(data);
      window.location.reload();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateUser();
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
                {user.first_name}
                <i className="material-icons right">arrow_drop_down</i>
              </a>
            </li>
            <ul id="dropdown1" className="dropdown-content">
              <li>
                <a
                  onClick={() => navigate(`/users/${user.first_name}/profile`)}
                >
                  Profile Data
                </a>
              </li>
              <li className="divider" tabIndex="-1"></li>
              <li>
                <a
                  onClick={() => navigate(`/users/${user.first_name}/password`)}
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
          {error === "User already exists" ? (
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
              value={userData.email}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="row-input">
          <div className="col s12">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              value={userData.first_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setUserData({ ...userData, first_name: e.target.value })
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
              value={userData.last_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setUserData({ ...userData, last_name: e.target.value })
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
              value={userData.DNI}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setUserData({ ...userData, DNI: e.target.value })
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
              value={userData.phone}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="container-button-login-register-partner">
          <button type="submit" className="waves-effect waves-light btn">
            Update Profile
          </button>
        </div>
      </form>
      {confirmDelete && (
        <div className="delete-confirm-container">
          <div className="delete-confirm">
            <h5>
              If you delete your profile, the Reservations will also be deleted.
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
                  deleteUser();
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

export default Profile;
