import React from "react";

function Rating({ rating, numReviews, seller, caption }) {
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating >= 1
              ? "fa fa-star"
              : rating >= 0.5
              ? "fa fa-star-half-alt"
              : "fa fa-star-o"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 2
              ? "fa fa-star"
              : rating >= 1.5
              ? "fa fa-star-half-alt"
              : "fa fa-star-o"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 3
              ? "fa fa-star"
              : rating >= 2.5
              ? "fa fa-star-half-alt"
              : "fa fa-star-o"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 4
              ? "fa fa-star"
              : rating >= 3.5
              ? "fa fa-star-half-alt"
              : "fa fa-star-o"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 5
              ? "fa fa-star"
              : rating >= 4.5
              ? "fa fa-star-half-alt"
              : "fa fa-star-o"
          }
        ></i>
      </span>
      {seller ? (
        <span>({numReviews ? (numReviews !== "" ? numReviews : 0) : 0})</span>
      ) : caption ? (
        <span>{caption}</span>
      ) : (
        <span>
          {numReviews} review{numReviews === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}

export default Rating;
