import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import { summaryOrder } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

function DashboardScreen() {
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);

  return (
    <div className="margins">
      <div className="row">
        <span className="aside__title">Dashboard</span>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <ul className="row summary">
            <li>
              <div className="summary-title color1">
                <span>
                  <i className="fa fa-users" /> Users
                </span>
              </div>
              <div className="summary-body">{summary.users[0].numUsers}</div>
            </li>
            <li>
              <div className="summary-title color2">
                <span>
                  <i className="fa fa-shopping-cart" /> Orders
                </span>
              </div>
              <div className="summary-body">
                {summary.orders[0] ? summary.orders[0].numOrders : 0}
              </div>
            </li>
            <li>
              <div className="summary-title color3">
                <span>
                  <i className="fa fa-money" /> Sales
                </span>
              </div>
              <div className="summary-body">
                $
                {summary.orders[0]
                  ? summary.orders[0].totalSales.toFixed(2)
                  : 0}
              </div>
            </li>
          </ul>
          <hr className="hr" />
          <div>
            <div>
              <span className="aside__title">Sales</span>
              {summary.dailyOrders.length === 0 ? (
                <MessageBox>No Sales</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Loading Chart</div>}
                  options={{
                    animation: {
                      duration: 3000,
                      easing: "out",
                      startup: true,
                    },
                    backgroundColor: "transparent",
                  }}
                  data={[
                    ["Date", "Sales"],
                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                  ]}
                />
              )}
            </div>
          </div>
          <hr className="hr" />
          <div>
            <span className="aside__title">Categories</span>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Categories</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                options={{
                  animation: {
                    duration: 3000,
                    easing: "out",
                    startup: true,
                  },
                  backgroundColor: "transparent",
                }}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardScreen;
