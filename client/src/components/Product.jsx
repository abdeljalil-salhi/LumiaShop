import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

function Product({ product }) {
  return (
    <div className="card">
      <Link to={`/product/${product._id}`} draggable="false">
        <img
          draggable="false"
          className="medium"
          src={product.image}
          alt="product"
        />
      </Link>
      <div className="card__body">
        <Link to={`/product/${product._id}`} draggable="false">
          <span className="card__name">{product.name}</span>
        </Link>
        <Rating numReviews={product.numReviews} rating={product.rating} />
        <div className="row">
          <div className="price">${product.price}</div>
          {product.seller?.seller?.name && (
            <div>
              <Link to={`/seller/${product.seller?._id}`} draggable="false">
                <small>
                  <i class="fas fa-user-alt"></i>{" "}
                </small>
                {product.seller?.seller?.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
