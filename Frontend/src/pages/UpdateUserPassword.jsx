import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { putUserIdPasswordRequest } from "../api/user.api";
import NavbarMenu from "../components/Navbars/NavbarMenu";

function UpdateUserPassword() {
  const { logout, user, error, setError } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updatePassword = async (dataPassword) => {
    try {
      const data = await putUserIdPasswordRequest(user.user_ID, dataPassword);
      console.log(data);
      navigate(`/users/${user.first_name}`);
    } catch (error) {
      console.error(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const onSubmit = handleSubmit((data) => {
    updatePassword(data);
  });

  return (
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <main>
        <form className="basic-form col s12" onSubmit={onSubmit}>
          <h3 className="center-title">Update User Password</h3>
          <div className="container-errors">
            {typeof error === "string" ? <div className="error">{error}</div> : <div></div>}
          </div>
          <div className="row-input">
            <div className="input-field col s12">
              <input
                id="oldPassword"
                type="password"
                className="validate"
                autoComplete="off"
                spellCheck={false}
                {...register("oldPassword", {
                  required: { value: true, message: "Old Password is required" },
                  minLength: {
                    value: 6,
                    message: "Old Password must be at least 6 characters",
                  },
                })}
              />
              <label htmlFor="oldPassword">Old Password</label>
              <div className="container-span">
                {errors.oldPassword && <span>{errors.oldPassword.message}</span>}
              </div>
            </div>
          </div>
          <div className="row-input">
            <div className="input-field col s12">
              <input
                id="newPassword"
                type="password"
                className="validate"
                autoComplete="off"
                spellCheck={false}
                {...register("newPassword", {
                  required: { value: true, message: "New Password is required" },
                  minLength: {
                    value: 6,
                    message: "New Password must be at least 6 characters",
                  },
                })}
              />
              <label htmlFor="newPassword">New Password</label>
              <div className="container-span">
                {errors.newPassword && <span>{errors.newPassword.message}</span>}
              </div>
            </div>
          </div>
          <div className="row-input">
            <div className="input-field col s12">
              <input
                id="againNewPassword"
                type="password"
                className="validate"
                autoComplete="off"
                spellCheck={false}
                {...register("againNewPassword", {
                  required: {
                    value: true,
                    message: "Again New Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Again New Password must be at least 6 characters",
                  },
                })}
              />
              <label htmlFor="againNewPassword">Again New Password</label>
              <div className="container-span">
                {errors.againNewPassword && <span>{errors.againNewPassword.message}</span>}
              </div>
            </div>
          </div>
          <div className="universal-container-button">
            <button type="submit" className="common-button">
              Update Password
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default UpdateUserPassword;
