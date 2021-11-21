import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, userInfo._id, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        })
      );
    }
  };

  return (
    <div className="margins">
      <form action="" className="form" onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate ? (
              <LoadingBox />
            ) : (
              <>
                {errorUpdate && (
                  <MessageBox variant="danger">{errorUpdate}</MessageBox>
                )}
                {successUpdate && (
                  <MessageBox variant="success">
                    Profile updated successfully
                  </MessageBox>
                )}
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {user.isSeller && (
                  <>
                    <h2>Seller</h2>
                    <div>
                      <input
                        id="sellerName"
                        type="text"
                        placeholder="Seller name"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                      ></input>
                    </div>
                    <div>
                      <input
                        id="sellerLogo"
                        type="text"
                        placeholder="Seller logo"
                        value={sellerLogo}
                        onChange={(e) => setSellerLogo(e.target.value)}
                      ></input>
                    </div>
                    <div>
                      <input
                        id="sellerDescription"
                        type="text"
                        placeholder="Seller description"
                        value={sellerDescription}
                        onChange={(e) => setSellerDescription(e.target.value)}
                      ></input>
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor=""></label>
                  <ul>
                    <li className="li__button">
                      <button className="primary block" type="submit">
                        Update &gt;&gt;
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default ProfileScreen;
