import { transformDateZ } from "../functions/dates";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TruncateText from "./TruncateText";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey" }}
      onClick={onClick}
    ></div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey" }}
      onClick={onClick}
    ></div>
  );
};

function SliderComponent({ comments }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="container-slider">
      <Slider {...settings}>
        {comments.map((comment, index) => (
          <div key={index} id="comment-card" className="card">
            <div className="card-content">
              <div className="comment_profile">
                <div className="comment_initial">{comment.first_name.split("")[0]}</div>
                <div className="comment_name">
                  {comment.first_name} {comment.last_name}
                  <p className="comment_nacionality">{comment.nacionality}</p>
                </div>
              </div>
              <div className="comment_reviewed">
                Reviewed: {transformDateZ(comment.comment_date)}
              </div>
              {/* <p className="comment_content">"{comment.content}"</p> */}
              <TruncateText text={`"${comment.content}"`} maxLength={200} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderComponent;
