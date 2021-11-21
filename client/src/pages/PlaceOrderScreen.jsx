import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const dispatch = useDispatch();

  if (!cart.paymentMethod) {
    props.history.push("/payment");
  }

  const toPrice = (num) => Number(num.toFixed(2));

  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(0.2 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      {loading ? (
        <LoadingBox />
      ) : (
        <div className="row top margins">
          <div className="col__2">
            <ul className="">
              <li>
                <div className="placeorder__div">
                  <span className="placeorder__title">Shipping</span>
                  <p className="placeorder__p">
                    <div>
                      <span className="placeorder__strong">M.</span>{" "}
                      {shippingAddress.fullName} <br />
                    </div>
                    <div>
                      <span className="placeorder__strong">Ship to</span>{" "}
                      {shippingAddress.address}, {shippingAddress.city},{" "}
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </div>
                  </p>
                </div>
              </li>
              <li>
                <div className="">
                  <span className="placeorder__title">Payment</span>
                  <p className="placeorder__p">
                    <div className="alignitems">
                      <span className="placeorder__strong mr">Method:</span>{" "}
                      {cart.paymentMethod === "PayPal" ? (
                        <img src="../images/paypal.png" alt="" height="30" />
                      ) : (
                        <img src="../images/stripe.png" alt="" height="30" />
                      )}
                    </div>
                  </p>
                </div>
              </li>
              <hr class="placeorder__hr" />
              <li>
                <div className="placeorder__div">
                  <span className="placeorder__title mb">Order Items</span>
                  <ul>
                    {cart.cartItems.map((item) => {
                      return (
                        <li key={item.product} className="cart-item">
                          <div className="row">
                            <div>
                              <img
                                src={`../${item.image}`}
                                alt={item.name}
                                className="cart-image"
                              />
                            </div>
                          </div>
                          <div className="min-30">
                            <Link to={`../product/${item.product}`}>
                              <span className="placeorder__strong">
                                x{item.qty}
                              </span>{" "}
                              <span className="cart-name">{item.name}</span>
                            </Link>
                          </div>
                          <div className="cart-price">
                            ${item.qty * item.price}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-1">
            <div className="card card-body">
              <ul className="card-ul">
                <li className="card-cart">
                  <span className="placeorder__strong">Order Summary</span>
                </li>
                <li className="card-cart">
                  <div className="row">
                    <div>Items</div>
                    <div>${cart.itemsPrice.toFixed(2)}</div>
                  </div>
                  <div className="row">
                    <div>Shipping</div>
                    <div>${cart.shippingPrice.toFixed(2)}</div>
                  </div>
                  <div className="row">
                    <div>Tax</div>
                    <div>${cart.taxPrice.toFixed(2)}</div>
                  </div>
                  <div className="row placeorder__strong">
                    <div>
                      <span>Total</span>
                    </div>
                    <div>${cart.totalPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={placeOrderHandler}
                    className="checkout__button"
                    disabled={cart.cartItems.length === 0}
                  >
                    Place Order
                  </button>
                </li>
                {error && <MessageBox variant="danger">{error}</MessageBox>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaceOrderScreen;
