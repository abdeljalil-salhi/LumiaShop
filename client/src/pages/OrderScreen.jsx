import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import { deliverOrder, detailsOrder, payOrder } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import Axios from "axios";

function OrderScreen(props) {
  const [sdkReady, setSdkReady] = useState(false);
  const orderId = props.match.params.id;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, orderId, successDeliver, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  return error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <div className="row top margins">
            <div className="col__2">
              <h1>Order#{order._id}</h1>
              <ul className="">
                <li>
                  <div className="placeorder__div">
                    <span className="placeorder__title">Shipping</span>
                    <p className="placeorder__p">
                      <div>
                        <span className="placeorder__strong">M.</span>{" "}
                        {order.shippingAddress.fullName} <br />
                      </div>
                      <div>
                        <span className="placeorder__strong">Ship to</span>{" "}
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.postalCode},{" "}
                        {order.shippingAddress.country}
                      </div>{" "}
                      <br />
                      {order.isDelivered ? (
                        <MessageBox variant="success">
                          Delivered at {order.deliveredAt}
                        </MessageBox>
                      ) : (
                        <MessageBox variant="danger">Not delivered</MessageBox>
                      )}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="">
                    <span className="placeorder__title">Payment</span>
                    <p className="placeorder__p">
                      <div className="alignitems">
                        <span className="placeorder__strong mr">Method:</span>{" "}
                        {order.paymentMethod === "PayPal" ? (
                          <img src="../images/paypal.png" alt="" height="30" />
                        ) : (
                          <img src="../images/stripe.png" alt="" height="30" />
                        )}
                      </div>{" "}
                      <br />
                      {order.isPaid ? (
                        <MessageBox variant="success">
                          Paid at {order.paidAt}
                        </MessageBox>
                      ) : (
                        <MessageBox variant="danger">Not paid</MessageBox>
                      )}
                    </p>
                  </div>
                </li>
                <hr class="placeorder__hr" />
                <li>
                  <div className="placeorder__div">
                    <span className="placeorder__title mb">Order Items</span>
                    <ul>
                      {order.orderItems.map((item) => {
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
                      <div>${order.itemsPrice.toFixed(2)}</div>
                    </div>
                    <div className="row">
                      <div>Shipping</div>
                      <div>${order.shippingPrice.toFixed(2)}</div>
                    </div>
                    <div className="row">
                      <div>Tax</div>
                      <div>${order.taxPrice.toFixed(2)}</div>
                    </div>
                    <div className="row placeorder__strong">
                      <div>
                        <span>Total</span>
                      </div>
                      <div>${order.totalPrice.toFixed(2)}</div>
                    </div>
                    {!order.isPaid && (
                      <li>
                        <br />
                        {!sdkReady ? (
                          <LoadingBox />
                        ) : (
                          <>
                            {errorPay && (
                              <MessageBox variant="danger">
                                {errorPay}
                              </MessageBox>
                            )}
                            {loadingPay && <LoadingBox />}
                            <PayPalButton
                              amount={order.totalPrice.toFixed(2)}
                              onSuccess={successPaymentHandler}
                            />
                          </>
                        )}
                      </li>
                    )}
                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                      <li>
                        <hr />
                        <small>
                          <b>Admin Panel</b>
                        </small>
                        <br />
                        {loadingDeliver && <LoadingBox />}
                        {errorDeliver && (
                          <MessageBox variant="danger">
                            {errorDeliver}
                          </MessageBox>
                        )}
                        <button
                          type="button"
                          className="infos green"
                          onClick={deliverHandler}
                        >
                          <i class="fas fa-truck"></i>&nbsp;&nbsp;Deliver Order
                        </button>
                      </li>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderScreen;
