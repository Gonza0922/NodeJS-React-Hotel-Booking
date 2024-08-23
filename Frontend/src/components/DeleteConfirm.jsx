import { toast } from "react-hot-toast";
import { MyDeleteOutlineIcon } from "./Icons";

const DeleteConfirm = ({
  text,
  id,
  showConfirmDelete,
  deleteReservation,
  buttonName,
  toastText,
}) => (
  <div className="delete-confirm-container">
    <div className="delete-confirm">
      <h5>{text}</h5>
      <div className="container-button-delete-confirm">
        <button onClick={() => showConfirmDelete(id)} className="button-cancel-confirm">
          Cancel
        </button>
        <button
          onClick={() => {
            deleteReservation(id);
            showConfirmDelete(id);
            toast(toastText, {
              icon: <MyDeleteOutlineIcon />,
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
          {buttonName}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
