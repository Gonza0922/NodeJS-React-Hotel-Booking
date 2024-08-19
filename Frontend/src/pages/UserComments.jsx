import { getHotelIdRequest } from "../api/hotel.api";
import { useEffect, useState } from "react";
import { resetDate } from "../functions/dates.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { usePartnerContext } from "../context/PartnerContext.jsx";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "../components/Navbars/NavbarMenu.jsx";
import {
  getCommentPerUserRequest,
  deleteCommentRequest,
  putCommentRequest,
} from "../api/comment.api.js";
import DeleteConfirm from "../components/DeleteConfirm.jsx";

function UserComments() {
  const { setRedirect, setErrorRedirect } = useHotelContext();
  const { logout, user, error, setError } = useUserContext();
  const { elementView, setElementView, styles, setStyles } = usePartnerContext();
  const [comments, setComments] = useState([]);
  const [commentHotel, setCommentHotel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const clickGetComments = async () => {
      try {
        const data = await getCommentPerUserRequest(user.user_ID);
        const finalComments = [];
        const hotelDataArray = [];
        for (const comment of data) {
          const hotelData = await getHotelIdRequest(comment.hotel_ID);
          hotelDataArray.push(hotelData);
          finalComments.push({ ...comment, isEditing: false });
        }
        setComments(finalComments);
        console.log(finalComments);
        setCommentHotel(hotelDataArray);
      } catch (error) {
        setRedirect(true);
        setErrorRedirect(error.message);
      }
    };
    clickGetComments();
  }, []);

  const handleEditClick = async (id, boolean) => {
    if (!boolean) {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_ID === id ? { ...comment, isEditing: true } : comment
        )
      );
    } else {
      try {
        const newComment = comments.find((comment) => comment.comment_ID === id);
        await putCommentRequest(newComment.comment_ID, { content: newComment.content });
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_ID === id ? { ...comment, isEditing: false } : comment
          )
        );
        console.log("edited");
      } catch (error) {
        console.error(error);
        const e = error.response.data;
        e.message ? setError(e.message) : setError([e.error]);
      }
    }
  };

  const handleInputChange = (id, value) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.comment_ID === id ? { ...comment, content: value } : comment
      )
    );
  };

  const deleteComment = async (id) => {
    try {
      await deleteCommentRequest(id);
      setComments(comments.filter((comment) => comment.comment_ID !== id));
    } catch (error) {
      console.error(error);
      setRedirect(true);
      setErrorRedirect(error.message);
    }
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
    <>
      <NavbarMenu navigation={"users"} profile={user} logout={logout} />
      <h3 className="center-title">My Reviews</h3>
      {comments.length === 0 ? (
        <div className="no-comments">
          <h4>THERE ARE NO REVIEWS...</h4>
          <button onClick={() => navigate("/login")} className="common-button">
            Start by making a Review
          </button>
        </div>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="container-my-comments">
            <div id="comments-card" className="card">
              <div className="card-content">
                <span className="my-comment_id">Comment_ID: {comment.comment_ID}</span>
                <span>Reviewed: {resetDate(comment.comment_date)}</span>
                {commentHotel < 1 ? (
                  <p></p>
                ) : (
                  <h6 className="my-comment_hotel">To: {commentHotel[index].name}</h6>
                )}
                {comment.isEditing ? (
                  <>
                    <div className="container-errors">
                      {error.length > 0 ? <div className="error">{error[0]}</div> : <div></div>}
                    </div>
                    <textarea
                      id="update-comment"
                      value={comment.content}
                      onChange={(e) => handleInputChange(comment.comment_ID, e.target.value)}
                      autoFocus
                      spellCheck={false}
                    />
                  </>
                ) : (
                  <span className="my-comment_content">"{comment.content}"</span>
                )}
                <div className="container-my-comment_edit-delete">
                  <button
                    onClick={() => showConfirmDelete(comment.comment_ID)}
                    className="buttons-right-delete"
                  >
                    Delete Review
                  </button>
                  <button
                    onClick={() => handleEditClick(comment.comment_ID, comment.isEditing)}
                    className="buttons-right"
                  >
                    {!comment.isEditing ? "Edit Review" : "Confirm Review"}
                  </button>
                </div>
              </div>
            </div>
            {comment.comment_ID === elementView.confirmDelete && (
              <DeleteConfirm
                text={`Delete Review ${comment.comment_ID}?`}
                id={comment.comment_ID}
                showConfirmDelete={showConfirmDelete}
                deleteReservation={deleteComment}
                buttonName={"Delete"}
              />
            )}
          </div>
        ))
      )}
    </>
  );
}

export default UserComments;
