import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext.jsx";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useHotelContext } from "../context/HotelContext.jsx";
import { transformDateZ } from "../functions/dates.js";
import { Countrys } from "../components/Countrys.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileSchema } from "../validations/profile.validation.js";
import { deleteUserRequest, getUserIdRequest, putUserIdRequest } from "../api/user.api.js";

function UpdateUserProfile() {
  const { logout, user, error, setError } = useUserContext();
  const { confirmDelete, setConfirmDelete } = usePartnerContext();
  const { setRedirect, setErrorRedirect, load, setLoad } = useHotelContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(updateProfileSchema) });
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    nacionality: "",
    phone: "",
  });

  useEffect(() => {
    M.AutoInit();
    setLoad("Update Profile");
    const clickGetUser = async () => {
      try {
        const data = await getUserIdRequest(user.user_ID);
        setUserData({
          ...data,
          password: "",
          birthdate: transformDateZ(data.birthdate),
        });
        reset({
          ...data,
          password: "",
          birthdate: transformDateZ(data.birthdate),
        });
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetUser();
  }, []);

  const updateUser = async (user) => {
    try {
      const data = await putUserIdRequest({
        ...user,
        phone: Number(user.phone),
      });
      return data;
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      data = {
        ...data,
        birthdate: transformDateZ(data.birthdate),
      };
      console.log(data);
      const newUser = await updateUser(data);
      if (newUser) {
        setLoad("Updating Profile...");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <nav className="nav-wrapper">
        <a className="hotelscom-logo" onClick={() => navigate("/")}>
          Hotels.com
        </a>
        <ul className="nav-wrapper_ul">
          <li>
            <button className="delete-nav-button" onClick={() => setConfirmDelete(true)}>
              Delete Profile
            </button>
          </li>
          <li>
            <a className="dropdown-trigger" href="#!" data-target="dropdown1">
              {user.first_name}
              <i className="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <ul id="dropdown1" className="dropdown-content">
            <li>
              <a onClick={() => navigate(`/users/${user.first_name}/profile`)}>Profile Data</a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <a onClick={() => navigate(`/users/${user.first_name}/password`)}>
                Change Password
              </a>
            </li>
            <li className="divider" tabIndex="-2"></li>
            <li>
              <a onClick={() => navigate(`/users/${user.first_name}/reviews`)}>Reviews</a>
            </li>
            <li className="divider" tabIndex="-3"></li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </ul>
      </nav>
      <form className="basic-form col s12" onSubmit={onSubmit}>
        <h3 className="form-title">Update Profile</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={userData.email}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("email", {
                onChange: (e) => {
                  setUserData({ ...userData, email: e.target.value });
                },
              })}
            />
            <div className="container-span">
              {errors.email && <span>{errors.email.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              value={userData.first_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("first_name", {
                onChange: (e) => {
                  setUserData({ ...userData, first_name: e.target.value });
                },
              })}
            />
            <div className="container-span">
              {errors.first_name && <span>{errors.first_name.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              value={userData.last_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("last_name", {
                onChange: (e) => {
                  setUserData({ ...userData, last_name: e.target.value });
                },
              })}
            />
            <div className="container-span">
              {errors.last_name && <span>{errors.last_name.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              value={userData.phone}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("phone", {
                onChange: (e) => {
                  setUserData({ ...userData, phone: e.target.value });
                },
              })}
            />
            <div className="container-span">
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="birthdate">Date of Birth</label>
            <input
              id="birthdate"
              type="date"
              value={userData.birthdate}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("birthdate", {
                onChange: (e) => {
                  setUserData({ ...userData, birthdate: e.target.value });
                },
              })}
            />
            <div className="container-span">
              {errors.birthdate && <span>{errors.birthdate.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <Controller
              name="nacionality"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <select {...field} className="browser-default">
                  <Countrys />
                </select>
              )}
            />
            <div className="container-span">
              {errors.nacionality && <span>{errors.nacionality.message}</span>}
            </div>
          </div>
        </div>
        <div className="universal-container-button">
          <button type="submit" className="common-button">
            {load}
          </button>
        </div>
      </form>
      {confirmDelete && (
        <div className="delete-confirm-container">
          <div className="delete-confirm">
            <h5>If you delete your profile, the Reservations will also be deleted.</h5>
            <div className="container-button-delete-confirm">
              <button onClick={() => setConfirmDelete(false)} className="button-cancel-confirm">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser();
                  setConfirmDelete(false);
                }}
                className="button-delete-confirm"
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

export default UpdateUserProfile;
