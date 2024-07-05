const DeleteConfirm = ({ id, showConfirmDelete, deleteReservation }) => (
  <div className="delete-confirm-container">
    <div className="delete-confirm">
      <h5>Decline reservation {id}?</h5>
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
          Decline
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
