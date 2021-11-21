import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
import MessageBox from "../components/MessageBox";

function CartScreen(props) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems, error } = cart;
  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  return (
    <div className="row top margins">
      <div className="col__cart">
        <h1>Shopping Cart</h1>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping.</Link>
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => {
              return (
                <li key={item.product} className="cart-item">
                  <div className="row">
                    <div>
                      <img
                        src={`..${item.image}`}
                        alt={item.name}
                        className="cart-image"
                      />
                    </div>
                  </div>
                  <div className="min-30">
                    <Link
                      to={`../product/${item.product}`}
                      className="cart-name"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div>
                    <select
                      className="cart-select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.stock).keys()].map((x) => {
                        return (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="cart-price">${item.price}</div>
                  <div>
                    <button
                      type="button"
                      className="cart-button"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul className="card-ul">
            <li className="card-cart">
              <span>
                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items) : $
                {cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
              </span>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="checkout__button"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CartScreen;
