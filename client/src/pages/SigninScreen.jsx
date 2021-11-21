import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signin } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

function SigninScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;
  const dispatch = useDispatch();

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
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
              <label htmlFor=""></label>
              <button className="signin-btn" type="submit">
                Sign In
              </button>
            </div>
            <div>
              <label htmlFor=""></label>
              <div>
                New customer?{" "}
                <Link
                  to={`/register?redirect=${redirect}`}
                  className="form-link"
                >
                  Create an account &gt;&gt;
                </Link>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default SigninScreen;
