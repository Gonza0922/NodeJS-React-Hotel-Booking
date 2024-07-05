const DeleteConfirm = ({ text, id, showConfirmDelete, deleteReservation, buttonName }) => (
  <div className="delete-confirm-container">
    <div className="delete-confirm">
      <h5>{text}</h5>
      <div className="container-button-delete-confirm">
        <button
          onClick={() => showConfirmDelete(id)}
          className="button-delete-confirm waves-effect waves-light btn blue darken-2"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            deleteReservation(id);
            showConfirmDelete(id);
          }}
          className="button-delete-confirm waves-effect waves-light btn red darken-2"
        >
          {buttonName}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
