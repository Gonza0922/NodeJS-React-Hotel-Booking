import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import { transformDateZ } from "../functions/dates";
import { Countrys } from "../components/Countrys";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../validations/profile.validation.js";
import {
  getPartnerIdRequest,
  putPartnerIdRequest,
  deletePartnerRequest,
} from "../api/partner.api";

function UpdatePartnerProfile() {
  const { logout, partner, error, setError, confirmDelete, setConfirmDelete } =
    usePartnerContext();
  const { setRedirect, setErrorRedirect, load, setLoad } = useHotelContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(profileSchema) });
  const navigate = useNavigate();
  const [partnerData, setPartnerData] = useState({
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
        const data = await getPartnerIdRequest(partner.partner_ID);
        setPartnerData({
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

  const updatePartner = async (partner) => {
    try {
      const data = await putPartnerIdRequest({
        ...partner,
        phone: Number(partner.phone),
      });
      return data;
    } catch (error) {
      console.log(error);
      setError(error.response.data.message[0]);
    }
  };

  const deletePartner = async () => {
    try {
      await deletePartnerRequest(partner.partner_ID);
      window.location.reload();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    try {
      data = {
        ...data,
        birthdate: transformDateZ(data.birthdate),
      };
      console.log(data);
      updatePartner(data);
      setLoad("Updating Profile...");
      setTimeout(() => {
        navigate(`/partners/${partner.first_name}`);
        setLoad("Update Profile");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  });

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
        <h3 className="title-update">Update Profile</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="my-input-field col s12">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={partnerData.email}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("email", {
                onChange: (e) => {
                  setPartnerData({ ...partnerData, email: e.target.value });
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
              value={partnerData.first_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("first_name", {
                onChange: (e) => {
                  setPartnerData({
                    ...partnerData,
                    first_name: e.target.value,
                  });
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
              value={partnerData.last_name}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("last_name", {
                onChange: (e) => {
                  setPartnerData({ ...partnerData, last_name: e.target.value });
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
              value={partnerData.phone}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("phone", {
                onChange: (e) => {
                  setPartnerData({ ...partnerData, phone: e.target.value });
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
              value={partnerData.birthdate}
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("birthdate", {
                onChange: (e) => {
                  setPartnerData({ ...partnerData, birthdate: e.target.value });
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

export default UpdatePartnerProfile;
