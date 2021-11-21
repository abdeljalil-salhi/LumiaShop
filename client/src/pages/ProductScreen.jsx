import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { createReview, detailsProduct } from "../actions/productActions";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productsConstants";
import { Twemoji } from "react-emoji-render";

function ProductScreen(props) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;
  const productId = props.match.params.id;

  useEffect(() => {
    if (successReviewCreate) {
      setRating("");
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert("Please enter comment and rating");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant={"danger"}>{error}</MessageBox>
      ) : (
        <>
          <Link to="/" className="margins">
            <i class="fas fa-arrow-left"></i> Back
          </Link>
          <div className="row top margins">
            <div className="cols">
              <div className="col__2">
                <img src={`..${product.image}`} alt={product.name} />
              </div>
              <div className="col__1">
                <ul>
                  <li className="li__name">
                    <span>{product.name}</span>
                  </li>
                  <li className="li__description">{product.description}</li>
                  <li className="li__price">
                    <span>${product.price}</span>
                  </li>
                  <li className="li__stock">
                    <span>
                      {product.stock > 0 ? (
                        <span className="success">In Stock</span>
                      ) : (
                        <span className="danger">Sold Out</span>
                      )}
                    </span>
                  </li>
                  <li className="li__rating">
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    />
                  </li>
                  {product.stock > 0 && (
                    <>
                      <li className="li__quantity">
                        <select
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.stock).keys()].map((x) => {
                            return (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            );
                          })}
                        </select>
                      </li>
                      <li className="li__button">
                        <button
                          className="primary block"
                          onClick={addToCartHandler}
                        >
                          Add to cart
                        </button>
                      </li>
                    </>
                  )}
                  <li className="li__delivered">
                    <i>Delivered in 2-5 weeks</i>
                  </li>
                  <br />
                  <li>
                    <div className="li__table">
                      <div>
                        <span>
                          <small>by </small>
                        </span>
                        <span className="li__seller">
                          {product.seller?.seller?.name ? (
                            <Link to={`/seller/${product.seller?._id}`}>
                              {product.seller?.seller?.name}
                            </Link>
                          ) : (
                            "unknown"
                          )}
                        </span>
                      </div>
                      {product.seller?.seller?.name && (
                        <span className="li__seller__rating">
                          <Rating
                            rating={product.seller?.seller?.rating}
                            numReviews={product.seller?.seller?.numReviews}
                            seller
                          ></Rating>
                        </span>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <hr className="hr" />
            <div className="reviews__div">
              <span id="reviews" className="aside__title">
                Reviews
              </span>
              {product.reviews.length === 0 && (
                <MessageBox>No reviews</MessageBox>
              )}
              <ul>
                {product.reviews.map((review) => (
                  <li className="reviews__list" key={review._id}>
                    <strong className="mml">{review.name}</strong>
                    <span className="reviews__date">
                      {review.createdAt.substring(0, 10)}
                    </span>
                    <small>
                      <Rating rating={review.rating} caption=" " />
                    </small>
                    <p>
                      <Twemoji
                        text={review.comment}
                        onlyEmojiClassName="makeEmojisLarge"
                      />
                    </p>
                  </li>
                ))}
                <li>
                  {loadingReviewCreate ? (
                    <LoadingBox />
                  ) : userInfo ? (
                    <form className="form" onSubmit={submitHandler}>
                      <div>
                        <h2>Write a customer review</h2>
                      </div>
                      <div className="reviews__form">
                        <label htmlFor="rating">Rating</label>
                        <select
                          id="rating"
                          value={rating}
                          className="reviews__rating"
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1- Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">3- Good</option>
                          <option value="4">4- Very good</option>
                          <option value="5">5- Excellent</option>
                        </select>
                      </div>
                      <div className="reviews__form">
                        <label htmlFor="comment">Comment</label>
                        <textarea
                          id="comment"
                          value={comment}
                          className="reviews__comment"
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="reviews__form">
                        <label />
                        <button
                          type="submit"
                          className="primary reviews__submit"
                        >
                          Submit
                        </button>
                      </div>
                      <div>
                        {errorReviewCreate && (
                          <MessageBox variant="danger">
                            {errorReviewCreate}
                          </MessageBox>
                        )}
                      </div>
                    </form>
                  ) : (
                    <MessageBox>
                      Please <Link to="/signin">Sign In</Link> to write a review
                    </MessageBox>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductScreen;
