import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, listUsers } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { USER_DETAILS_RESET } from "../constants/userConstants";

function UserListScreen(props) {
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsers());
    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);

  const deleteHandler = (user) => {
    if (window.confirm(`Delete "${user.name}" ?`)) {
      dispatch(deleteUser(user._id));
    }
  };

  return (
    <div className="margins">
      <h1>Users</h1>
      {successDelete && (
        <>
          <MessageBox variant="success">User Deleted Successfully</MessageBox>
          <br />
        </>
      )}
      {error && (
        <>
          <MessageBox variant="danger">{error}</MessageBox>
          <br />
        </>
      )}
      {errorDelete && (
        <>
          <MessageBox variant="danger">{errorDelete}</MessageBox>
          <br />
        </>
      )}
      {loading || loadingDelete ? (
        <LoadingBox />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? "YES" : " NO"}</td>
                <td>{user.isAdmin ? "YES" : "NO"}</td>
                <td>
                  <button
                    type="button"
                    className="small infos"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                  >
                    <i class="fas fa-pen"></i>&nbsp;&nbsp;Edit
                  </button>
                  <button
                    type="button"
                    className="small infos red"
                    onClick={() => deleteHandler(user)}
                  >
                    <i class="far fa-trash-alt"></i>&nbsp;&nbsp;Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserListScreen;
