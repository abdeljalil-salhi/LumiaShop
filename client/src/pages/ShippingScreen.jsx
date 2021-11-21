import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const userAddressMap = useSelector((state) => state.userAddressMap);
  const { address: addressMap } = userAddressMap;
  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [lat, setLat] = useState(shippingAddress.lat);
  const [lng, setLng] = useState(shippingAddress.lng);
  const dispatch = useDispatch();

  if (!userInfo) {
    props.history.push("/signin");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const newLat = addressMap ? addressMap.lat : lat;
    const newLng = addressMap ? addressMap.lng : lng;
    if (addressMap) {
      setLat(addressMap.lat);
      setLng(addressMap.lng);
    }
    let moveOn = true;
    if (!newLat || !newLng) {
      moveOn = window.confirm(
        "You did not set your location on map. Continue?"
      );
    }
    if (moveOn) {
      dispatch(
        saveShippingAddress({
          fullName,
          address,
          city,
          postalCode,
          country,
          lat: newLat,
          lng: newLng,
        })
      );
      props.history.push("/payment");
    }
  };

  const chooseOnMap = () => {
    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        postalCode,
        country,
        lat,
        lng,
      })
    );
    props.history.push("/map");
  };

  return (
    <div className="margins">
      <CheckoutSteps step1 step2 />
      <form action="" className="form" onSubmit={submitHandler}>
        <div>
          <h1>Shipping Address</h1>
        </div>
        <div>
          <input
            type="text"
            id="fullName"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="postalCode"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="chooseOnMap">Location</label>
          <button type="button" className="googlemaps__choose"onClick={chooseOnMap}>
            Choose On Map
          </button>
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

export default ShippingScreen;
