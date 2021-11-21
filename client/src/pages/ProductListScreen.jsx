import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from "../constants/productsConstants";

function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();
  const sellerMode = props.match.path.indexOf("/seller") >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : "", pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    pageNumber,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm("Are you sure to delete?")) {
      dispatch(deleteProduct(product._id));
    }
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div className="margins">
      <div className="row">
        <h1>Products</h1>
        <button type="button" className="admin-btn" onClick={createHandler}>
          <i class="fas fa-plus"></i>&nbsp;&nbsp;Create Product
        </button>
      </div>
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading || loadingCreate || loadingDelete ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>$ {product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      type="button"
                      className="small infos"
                      onClick={() =>
                        props.history.push(`/product/${product._id}/edit`)
                      }
                    >
                      <i class="fas fa-pen"></i>&nbsp;&nbsp;Edit
                    </button>
                    <button
                      type="button"
                      className="small infos red"
                      onClick={() => deleteHandler(product)}
                    >
                      <i class="far fa-trash-alt"></i>&nbsp;&nbsp;Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductListScreen;
