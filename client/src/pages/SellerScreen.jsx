import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { detailsUser } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";

function SellerScreen(props) {
  const sellerId = props.match.params.id;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProducts,
    error: errorProducts,
    products,
  } = productList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsUser(sellerId));
    dispatch(listProducts({ seller: sellerId }));
  }, [dispatch, sellerId]);

  return (
    <>
      {loading || loadingProducts ? (
        <LoadingBox />
      ) : (
        <div className="row top margins">
          <div className="col-1">
            {error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div className="card">
                <div className="card__body">
                  <div className="card__avatar__header">
                    <img
                      className="avatar"
                      src={
                        user.seller.logo
                          ? user.seller.logo
                          : "/uploads/noAvatar.png"
                      }
                      alt={user.seller.name}
                      draggable="false"
                    ></img>
                    <div className="card__avatar__header__center">
                      <span className="li__seller">
                        {user.seller.name}{" "}
                        {user.isVerified && <i class="far fa-check-circle"></i>}
                      </span>
                      <small>
                        <Rating
                          rating={user.seller.rating}
                          numReviews={user.seller.numReviews}
                        />
                      </small>
                    </div>
                  </div>
                  <div>{user.seller.description}</div>
                  <hr className="hr" />
                  <div>
                    <a href={`mailto:${user.email}`}>
                      <button className="infos green">
                        <i class="far fa-envelope"></i> Contact Seller
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-3">
            {errorProducts ? (
              <MessageBox variant="danger">{errorProducts}</MessageBox>
            ) : (
              <>
                {products?.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <div className="row center">
                  {products?.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SellerScreen;
