import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

function RegisterScreen(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const dispatch = useDispatch();

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [userInfo, props.history, redirect]);

  return (
    <div class="signin-div">
      <form action="" className="form" onSubmit={submitHandler}>
        {loading ? (
          <LoadingBox />
        ) : (
          <>
            {error && <MessageBox variant="danger">{error}</MessageBox>}
            <div>
              <input
                type="text"
                id="name"
                placeholder="Full name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor=""></label>
              <button className="signin-btn" type="submit">
                Register
              </button>
            </div>
            <div>
              <label htmlFor=""></label>
              <div>
                Already have an account?{" "}
                <Link to={`/signin?redirect=${redirect}`} className="form-link">
                  Sign in &gt;&gt;
                </Link>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default RegisterScreen;
