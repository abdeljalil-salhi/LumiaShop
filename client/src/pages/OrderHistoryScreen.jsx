import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrderMine } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

function OrderHistoryScreen(props) {
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);

  return (
    <div className="margins">
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger"> {error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>$ {order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? order.paidAt?.substring(0, 10) : "Not paid"}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "Not delivered"}
                  </td>
                  <td>
                    <button
                      type="submit"
                      className="small infos"
                      onClick={() => {
                        props.history.push(`/order/${order._id}`);
                      }}
                    >
                      <i class="fas fa-info"></i>&nbsp;&nbsp;Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistoryScreen;
