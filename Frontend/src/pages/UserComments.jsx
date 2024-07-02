import { getHotelIdRequest } from "../api/hotel.api";
import { useEffect, useState } from "react";
import { resetDate } from "../functions/dates.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import { getCommentPerUserRequest, deleteCommentRequest } from "../api/comment.api.js";

function UserComments() {
  const { setRedirect, setErrorRedirect } = useHotelContext();
  const { logout, user } = useUserContext();
  const { elementView, setElementView, styles, setStyles } = usePartnerContext();
  const [comments, setComments] = useState([]);
  const [commentHotel, setCommentHotel] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const clickGetComments = async () => {
      try {
        const data = await getCommentPerUserRequest(user.user_ID);
        setComments(data);
        const hotelDataArray = [];
        for (const comment of data) {
          const hotelData = await getHotelIdRequest(comment.hotel_ID);
          hotelDataArray.push(hotelData);
        }
        setCommentHotel(hotelDataArray);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetComments();
  }, []);

  const deleteComment = async (id) => {
    await deleteCommentRequest(id);
    setComments(comments.filter((comment) => comment.comment_ID !== id));
  };

  const showConfirmDelete = (id) => {
    setStyles((prevStyles) => !prevStyles);
    document.body.style.overflowY = styles ? "auto" : "hidden";
    setElementView((prevElement) => ({
      ...prevElement,
      confirmDelete: id === elementView.confirmDelete ? null : id,
    }));
  };

  return (
    <div className="alfa">
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <h3 className="my-reviews-title">My Reviews</h3>
      {comments.length === 0 ? (
        <div className="no-comments">
          <h4>THERE ARE NO REVIEWS...</h4>
          <button onClick={() => navigate("/login")} className="waves-effect waves-light btn">
            Start by making a Review
          </button>
        </div>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="container-my-comments">
            <div id="card-comments" className="card">
              <div className="card-content">
                <h6>Comment_ID: {comment.comment_ID}</h6>
                <h6>Reviewed: {resetDate(comment.comment_date)}</h6>
                {commentHotel < 1 ? <p></p> : <h6>To: {commentHotel[index].name}</h6>}
                <h5>"{comment.content}"</h5>
                <div className="container-edit-delete">
                  <button
                    onClick={() => showConfirmDelete(comment.comment_ID)}
                    className="delete waves-effect waves-light btn red darken-2"
                  >
                    Delete Review
                  </button>
                  <button
                    onClick={() => console.log("editing comment")}
                    className="delete waves-effect waves-light btn "
                  >
                    Edit Review
                  </button>
                </div>
              </div>
            </div>
            {comment.comment_ID === elementView.confirmDelete && (
              <div className="delete-confirm-container">
                <div className="delete-confirm">
                  <h5>Delete Review {comment.comment_ID}?</h5>
                  <div className="container-button-delete-confirm">
                    <button
                      onClick={() => showConfirmDelete(comment.comment_ID)}
                      className="button-delete-confirm waves-effect waves-light btn blue darken-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteComment(comment.comment_ID);
                        showConfirmDelete(comment.comment_ID);
                        window.scrollTo(0, 0);
                      }}
                      className="button-delete-confirm waves-effect waves-light btn red darken-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserComments;
