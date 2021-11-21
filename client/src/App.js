/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { listProductCategories } from "./actions/productActions";
import { signout } from "./actions/userActions";
import AdminRoute from "./components/AdminRoute";
import ChatBox from "./components/ChatBox";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";
import PrivateRoute from "./components/PrivateRoute";
import SearchBox from "./components/SearchBox";
import SellerRoute from "./components/SellerRoute";
import CartScreen from "./pages/CartScreen";
import DashboardScreen from "./pages/DashboardScreen";
import HomeScreen from "./pages/HomeScreen";
import MapScreen from "./pages/MapScreen";
import OrderHistoryScreen from "./pages/OrderHistoryScreen";
import OrderListScreen from "./pages/OrderListScreen";
import OrderScreen from "./pages/OrderScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import ProductEditScreen from "./pages/ProductEditScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductScreen from "./pages/ProductScreen";
import ProfileScreen from "./pages/ProfileScreen";
import RegisterScreen from "./pages/RegisterScreen";
import SearchScreen from "./pages/SearchScreen";
import SellerScreen from "./pages/SellerScreen";
import ShippingScreen from "./pages/ShippingScreen";
import SigninScreen from "./pages/SigninScreen";
import SupportScreen from "./pages/SupportScreen";
import UserEditScreen from "./pages/UserEditScreen";
import UserListScreen from "./pages/UserListScreen";

function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link to="/" className="brand">
              Lumia
            </Link>
          </div>
          <div>
            <Route render={({ history }) => <SearchBox history={history} />} />
          </div>
          <div>
            <Link to="/cart">
              <i className="fas fa-shopping-bag"></i> Cart{" "}
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name}&nbsp;&nbsp;
                  <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">
                      <i class="fas fa-user-alt"></i> Profile
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/orderhistory">
                      <i class="far fa-clock"></i> History
                    </Link>
                  </li>
                  <hr />
                  <li onClick={signoutHandler}>
                    <a href="javascript:void(0)">
                      <i class="fas fa-sign-out-alt"></i> Sign Out
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">
                <i className="fas fa-sign-in-alt"></i> Sign In
              </Link>
            )}
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Seller&nbsp;&nbsp;
                  <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">
                      <i class="fas fa-luggage-cart"></i> Products
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/orderlist/seller">
                      <i class="fas fa-shopping-basket"></i> Orders
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin&nbsp;&nbsp;
                  <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">
                      <i class="fas fa-chart-line"></i> Dashboard
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/productlist">
                      <i class="fas fa-luggage-cart"></i> Products
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/orderlist">
                      <i class="fas fa-shopping-basket"></i> Orders
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/userlist">
                      <i class="fas fa-user-alt"></i> Users
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/support">
                      <i class="fas fa-headset"></i> Support
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <aside className={sidebarIsOpen ? "open" : ""}>
          <ul className="categories">
            <li className="flexaround">
              <span className="aside__title">Categories</span>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox />
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/seller/:id?" component={SellerScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/product/:id" component={ProductScreen} exact />
          <Route path="/product/:id/edit" component={ProductEditScreen} exact />
          <Route path="/signin" component={SigninScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/orderhistory" component={OrderHistoryScreen} />
          <Route path="/search/name/:name?" component={SearchScreen} exact />
          <Route
            path="/search/category/:category"
            component={SearchScreen}
            exact
          />
          <Route
            path="/search/category/:category/name/:name"
            component={SearchScreen}
            exact
          />
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            component={SearchScreen}
            exact
          />
          
          <PrivateRoute path="/profile" component={ProfileScreen} />
          <PrivateRoute path="/map" component={MapScreen} />
          
          <AdminRoute path="/productlist" component={ProductListScreen} exact />
          <AdminRoute
            path="/productlist/pageNumber/:pageNumber"
            component={ProductListScreen}
            exact
          />
          <AdminRoute path="/orderlist" component={OrderListScreen} exact />
          <AdminRoute path="/userlist" component={UserListScreen} />
          <AdminRoute path="/user/:id/edit" component={UserEditScreen} />
          <AdminRoute path="/dashboard" component={DashboardScreen} />
          <AdminRoute path="/support" component={SupportScreen}/>

          <SellerRoute
            path="/productlist/seller"
            component={ProductListScreen}
          />
          <SellerRoute path="/orderlist/seller" component={OrderListScreen} />
          
          <Route path="/" component={HomeScreen} exact />
        </main>
        <footer className="row center">
          {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
          <div>All rights reserverd.</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
