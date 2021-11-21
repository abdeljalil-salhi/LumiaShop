import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { prices, ratings } from "../utils";

function SearchScreen(props) {
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
    pageNumber = 1,
  } = useParams();
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(
      listProducts({
        pageNumber,
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    );
  }, [category, dispatch, max, min, name, order, pageNumber, rating]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating
      ? filter.rating
      : filter.rating === 0
      ? 0
      : rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };

  return (
    <>
      {loading || loadingCategories ? (
        <LoadingBox />
      ) : (
        <>
          <div className="row margins">
            {error && <MessageBox variant="danger">{error}</MessageBox>}
          </div>
          <div className="row top margins">
            <div className="col__1">
              <span className="aside__title">Categories</span>
              <div>
                {errorCategories ? (
                  <MessageBox variant="danger">{errorCategories}</MessageBox>
                ) : (
                  <ul>
                    <li>
                      <Link
                        className={"all" === category ? "active" : ""}
                        to={getFilterUrl({ category: "all" })}
                      >
                        Any
                      </Link>
                    </li>
                    {categories.map((c) => (
                      <li key={c}>
                        <Link
                          className={c === category ? "active" : ""}
                          to={getFilterUrl({ category: c })}
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="placeorder__strong">Sort by </span>
                <select
                  value={order}
                  onChange={(e) => {
                    props.history.push(getFilterUrl({ order: e.target.value }));
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Avg. Customer Reviews</option>
                </select>
              </div>
              {showMore && (
                <>
                  <br />
                  <div>
                    <span className="placeorder__strong">
                      Avg. Customer Review
                    </span>
                    <ul>
                      {ratings.map((r) => (
                        <li key={r.name}>
                          <Link
                            to={getFilterUrl({ rating: r.rating })}
                            className={
                              `${r.rating}` === `${rating}` ? "active" : ""
                            }
                          >
                            <Rating caption={" & up"} rating={r.rating} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="placeorder__strong">Price</span>
                    <ul>
                      {prices.map((p) => (
                        <li key={p.name}>
                          <Link
                            to={getFilterUrl({ min: p.min, max: p.max })}
                            className={
                              `${p.min}-${p.max}` === `${min}-${max}`
                                ? "active"
                                : ""
                            }
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <div
                className="moreoptions"
                onClick={(e) => setShowMore(!showMore)}
              >
                Show {!showMore ? "more" : "less"} options...
              </div>
            </div>
            <div className="col-3">
              {error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <>
                  <div className="margins">
                    Searching for{" "}
                    <b>
                      {name === "all" && category === "all"
                        ? "all"
                        : name !== "all"
                        ? name
                        : name === "all" && category !== "all" && category}
                    </b>
                    , found {products.length} result
                    {products.length === 1 ? "" : "s"}
                  </div>
                  {products.length === 0 && (
                    <MessageBox>No Product Found</MessageBox>
                  )}
                  <div className="row center">
                    {products.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                  <div className="row center pagination">
                    {[...Array(pages).keys()].map((x) => (
                      <Link
                        className={x + 1 === page ? "active" : ""}
                        key={x + 1}
                        to={getFilterUrl({ page: x + 1 })}
                      >
                        {x + 1}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SearchScreen;
