import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";

function HomeScreen() {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const userTopSellersList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userTopSellersList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts({}));
    dispatch(listTopSellers());
  }, [dispatch]);

  return (
    <>
      <div>
        <span className="home__title">Top Sellers</span>
        {errorSellers && (
          <MessageBox variant="danger">{errorSellers}</MessageBox>
        )}
        {loadingSellers ? (
          <LoadingBox />
        ) : (
          sellers && (
            <>
              {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
              <Carousel
                showArrows
                autoPlay
                infiniteLoop
                useKeyboardArrows
                showThumbs={false}
                interval={5000}
              >
                {sellers.map((seller) => (
                  <div key={seller._id}>
                    <Link to={`/seller/${seller._id}`} draggable="false">
                      <img
                        src={
                          seller.seller.logo
                            ? seller.seller.logo
                            : "/uploads/noAvatar.png"
                        }
                        alt={seller.seller.name}
                        className="carousel__img"
                      />
                      <p className="legend">
                        <div className="legend__center">
                          <b>{seller.seller.name}</b>
                          <small>
                            <Rating
                              rating={seller.seller.rating}
                              numReviews={seller.seller.numReviews}
                              seller
                            />
                          </small>
                        </div>
                      </p>
                    </Link>
                  </div>
                ))}
              </Carousel>
            </>
          )
        )}
      </div>
      <br />
      <br />
      <span className="home__title">Featured Products</span>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant={"danger"}>{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default HomeScreen;
