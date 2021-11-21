import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const dispatch = useDispatch();

  if (!shippingAddress.address) {
    props.history.push("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push("/placeorder");
  };

  return (
    <div className="margins">
      <CheckoutSteps step1 step2 step3 />
      <form action="" className="form" onSubmit={submitHandler}>
        <div>
          <h1>Payment</h1>
        </div>
        <div className="form__radio">
          <input
            type="radio"
            name="paymentMethod"
            id="paypal"
            value="PayPal"
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            checked
          />
          <label htmlFor="paypal">
            <img src="/images/paypal.png" alt="" height="50" />
          </label>
        </div>
        <div className="form__radio">
          <input
            type="radio"
            name="paymentMethod"
            id="stripe"
            value="Stripe"
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <label htmlFor="stripe">
            <img src="/images/stripe.png" alt="" height="50" />
          </label>
        </div>
        <div>
          <label htmlFor=""></label>
          <button className="signin-btn" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentScreen;
