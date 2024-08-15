import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import NavbarLRP from "../../components/Navbars/NavbarLRP";
import { useUserContext } from "../../context/UserContext";

export function Login() {
  const { user, setUser, login, isAuthenticated, error } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/users/${user.first_name}`);
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    login(data);
    setUser(data);
  });

  return (
    <>
      <NavbarLRP />
      <form className="basic-form col s12" onSubmit={onSubmit}>
        <h3 className="center-title">Login Account</h3>
        <div className="container-errors">
          {error === "User not found" ? (
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
          <div className="linkToRegister-span">
            <span>Need an entity account? </span>
            <Link className="linkToRegister" to="/register">
              Sign Up
            </Link>
          </div>
          <div className="universal-container-button">
            <button type="submit" className="common-button">
              Sign In
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
