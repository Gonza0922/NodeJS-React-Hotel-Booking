import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "../context/PartnerContext";
import { useHotelContext } from "../context/HotelContext";
import { transformDateZ } from "../functions/dates";
import { Countrys } from "../components/Countrys";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileSchema } from "../validations/profile.validation.js";
import {
  getPartnerIdRequest,
  putPartnerIdRequest,
  deletePartnerRequest,
} from "../api/partner.api";
import { MyLogoutIcon, MyPasswordIcon, MyPersonIcon } from "../components/Icons.jsx";
import { toast } from "react-hot-toast";

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
  } = useForm({ resolver: yupResolver(updateProfileSchema) });
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
      console.error(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      data = {
        ...data,
        birthdate: transformDateZ(data.birthdate),
      };
      console.log(data);
      const newPartner = await updatePartner(data);
      if (newPartner) {
        setLoad("Updating Profile...");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <nav className="nav-wrapper">
        <div className="hotelscom-logo" onClick={() => navigate("/")}>
          Hotels.com
        </div>
        <ul className="nav-wrapper_ul">
          <li>
            <button className="delete-nav-button" onClick={() => setConfirmDelete(true)}>
              Delete Profile
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
      <form className="basic-form col s12" onSubmit={onSubmit}>
        <h3 className="center-title">Update Partner Profile</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? <div className="error">{error}</div> : <div></div>}
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
        <div className="universal-container-button">
          <button type="submit" className="common-button">
            {load}
          </button>
        </div>
      </form>
      {confirmDelete && (
        <div className="delete-confirm-container">
          <div className="delete-confirm">
            <h5>
              If you delete your profile, your hotels and their reservations will also be deleted.
            </h5>
            <div className="container-button-delete-confirm">
              <button onClick={() => setConfirmDelete(false)} className="button-cancel-confirm">
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePartner();
                  setConfirmDelete(false);
                  toast.success("All Profile deleted", {
                    style: {
                      borderRadius: "10px",
                      background: "#333",
                      color: "#fff",
                      padding: "15px",
                    },
                  });
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

export default UpdatePartnerProfile;
