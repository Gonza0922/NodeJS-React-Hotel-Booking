import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import NavbarLRP from "../../components/Navbars/NavbarLRP";
import { usePartnerContext } from "../../context/PartnerContext";
import { useHotelContext } from "../../context/HotelContext";
import { Countrys } from "../../components/Countrys";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../validations/profile.validation.js";

export function RegisterProperty() {
  const { partner, isAuthenticatedPartner, signUp, error } =
    usePartnerContext();
  const { load, setLoad } = useHotelContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(profileSchema) });
  const navigate = useNavigate();

  useEffect(() => {
    setLoad("Register");
  }, []);

  useEffect(() => {
    if (isAuthenticatedPartner) {
      const timer = setTimeout(() => {
        navigate(`/partners/${partner.first_name}`);
        if (load !== "Register") setLoad("Register");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticatedPartner]);

  const onSubmit = handleSubmit((data) => {
    data = { ...data, phone: Number(data.phone) };
    signUp(data);
    setLoad("Registering...");
  });

  return (
    <>
      <NavbarLRP />
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3 className="title-update">Register Partner</h3>
        <div className="container-errors">
          {!Array.isArray(error) ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="email"
              type="email"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("email")}
            />
            <label htmlFor="email">Email</label>
            <div className="container-span">
              {errors.email && <span>{errors.email.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="password"
              type="password"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <label htmlFor="password">Password</label>
            <div className="container-span">
              {errors.password && <span>{errors.password.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="first_name"
              type="text"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("first_name")}
            />
            <label htmlFor="first_name">First Name</label>
            <div className="container-span">
              {errors.first_name && <span>{errors.first_name.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="last_name"
              type="text"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("last_name")}
            />
            <label htmlFor="last_name">Last Name</label>
            <div className="container-span">
              {errors.last_name && <span>{errors.last_name.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="phone"
              type="number"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("phone")}
            />
            <label htmlFor="phone">Phone</label>
            <div className="container-span">
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
            <input
              id="birthdate"
              type="date"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("birthdate")}
            />
            <label htmlFor="birthdate">Date of Birth</label>
            <div className="container-span">
              {errors.birthdate && <span>{errors.birthdate.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field col s12">
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
        <div className="container-button-login-register-partner">
          <button
            type="button"
            onClick={() => navigate("/loginProperty")}
            className="waves-effect waves-light btn"
          >
            Login yor partner account
          </button>
        </div>
      </form>
    </>
  );
}

export default RegisterProperty;
