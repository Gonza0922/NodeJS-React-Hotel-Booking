import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import NavbarLRP from "../../components/Navbars/NavbarLRP";
import { usePartnerContext } from "../../context/PartnerContext";

export function LoginPartner() {
  const { partner, setPartner, isAuthenticatedPartner, login, error } = usePartnerContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticatedPartner) {
      navigate(`/partners/${partner.first_name}`);
    }
  }, [isAuthenticatedPartner]);

  const onSubmit = handleSubmit((data) => {
    login(data);
    setPartner(data);
    console.log(data);
  });

  return (
    <>
      <NavbarLRP />
      <form className="basic-form col s12" onSubmit={onSubmit}>
        <h3 className="form-title">Login Partner</h3>
        <div className="container-errors">
          {error === "Partner not found" ? (
            <div className="error">{error}</div>
          ) : error === "Incorrect Password" ? (
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
              spellCheck={false}
              {...register("password", {
                required: { value: true, message: "Password is required" },
              })}
            />
            <label htmlFor="password">Password</label>
            <div className="container-span">
              {errors.password && <span>{errors.password.message}</span>}
            </div>
          </div>
          <div className="universal-container-button">
            <button type="submit" id="button-padding" className="waves-effect waves-light btn">
              Sign In
            </button>
          </div>
          <div className="universal-container-button">
            <button
              type="button"
              id="button-padding"
              onClick={() => navigate("/registerpartner")}
              className="waves-effect waves-light btn"
            >
              Create yor partner account
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginPartner;
