import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import NavbarLRP from "../../components/Navbars/NavbarLRP";
import { usePartnerContext } from "../../context/PartnerContext";

export function RegisterProperty() {
  const { partner, setPartner, isAuthenticatedPartner, signUp, error } =
    usePartnerContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticatedPartner) {
      const timer = setTimeout(() => {
        navigate(`/partners/${partner.first_name}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticatedPartner]);

  const onSubmit = handleSubmit((data) => {
    signUp(data);
    setPartner(data);
    console.log(data);
  });

  return (
    <>
      <NavbarLRP navigation={"/"} />
      <form className="form-login-register-partner col s12" onSubmit={onSubmit}>
        <h3>Register Partner</h3>
        <div className="container-errors">
          {error === "The email already exists" ? (
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
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9-]+\.com$/,
                  message: "Invalid Email",
                },
              })}
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
              {...register("first_name", {
                required: { value: true, message: "First Name is required" },
                minLength: {
                  value: 2,
                  message: "First Name must be at least 2 characters",
                },
                maxLength: {
                  value: 20,
                  message: "First Name must be no more than 20 characters.",
                },
              })}
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
              {...register("last_name", {
                required: { value: true, message: "Last Name is required" },
                minLength: {
                  value: 2,
                  message: "Last Name must be at least 2 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Last Name must be no more than 20 characters.",
                },
              })}
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
              id="DNI"
              type="number"
              className="validate"
              autoComplete="off"
              {...register("DNI", {
                required: { value: true, message: "DNI is required" },
                minLength: {
                  value: 8,
                  message: "DNI must be 8 characters",
                },
                maxLength: {
                  value: 8,
                  message: "DNI must be 8 characters",
                },
              })}
            />
            <label htmlFor="DNI">DNI</label>
            <div className="container-span">
              {errors.DNI && <span>{errors.DNI.message}</span>}
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
              {...register("phone", {
                required: { value: true, message: "Phone is required" },
                minLength: {
                  value: 10,
                  message: "Phone must be at least 10 characters",
                },
                maxLength: {
                  value: 11,
                  message: "Phone must be no more than 11 characters.",
                },
              })}
            />
            <label htmlFor="phone">Phone</label>
            <div className="container-span">
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>
          </div>
        </div>
        <div className="container-button-login-register-partner">
          <button type="submit" className="waves-effect waves-light btn">
            Register
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
