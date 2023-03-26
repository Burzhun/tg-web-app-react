import React, { useState, useEffect, useCallback } from "react";
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import { db, loadDataDB } from "../firebase/config";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import Header from "../Header";
import { Button, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
  {
    title: "Номер заказа",
    dataIndex: "orderNumber",
    key: "orderNumber",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Наим. заказа",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Наим. товара",
    dataIndex: "itemName",
    key: "itemName",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "Кол. шт",
    dataIndex: "number",
    key: "number",
  },
];
const loadRelatedData = async (table) => {
  let t = {};
  let querySnapshot = await loadDataDB(table);
  querySnapshot.forEach((doc) => {
    t[doc.id] = doc;
  });
  return t;
};
let categories = {};
let items = {};
let units = {};
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();
  const params = useParams();
  const category = params.category || "";

  useEffect(() => {
    //loadData();
  }, [category]);

  const loadOrders = useCallback(async () => {
    categories = await loadRelatedData("categories");

    items = await loadRelatedData("items");
    units = await loadRelatedData("unit");

    const orders = await loadDataDB("orders");
    orders.forEach((order) => {
      if (items[order.item]) {
        order.itemName = items[order.item].title;
        if (units[items[order.item].unit]) {
          order.unit = units[items[order.item].unit].name;
        }
      }
    });
    setOrders(orders);
    console.log(orders, categories, items, units);
  }, []);

  useEffect(() => {
    loadOrders();
    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
  }, []);

  return (
    <div>
      {category && (
        <div style={{ fontSize: "20px", margin: "10px" }}>
          Товары категории <span style={{ color: "#1bb3ff" }}>{category}</span>
        </div>
      )}
      <div className={"list"}>
        <Table
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate("/orders/" + record.id);
              }, // click row
            };
          }}
          dataSource={orders}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          className="orderAddButton"
          onClick={() => {
            navigate("/orders/add");
          }}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
};

export default OrdersList;
