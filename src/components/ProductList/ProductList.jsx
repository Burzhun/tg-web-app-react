import React, { useState, useEffect, useCallback } from "react";
import "./ProductList.css";
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import { db, loadDataDB } from "../firebase/config";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import Header from "../Header";
import { Button, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};
let units = {};
let categories = {};
const columns = [
  {
    title: "Наим. товара",
    dataIndex: "title",
    key: "title",
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
let orderedItems = null;
const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [items, setItems] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();
  const params = useParams();
  const category = params.category || "";

  const loadData = async () => {
    if (orderedItems) return;
    orderedItems = {};
    const orders = await loadDataDB("orders");
    orders.forEach((order) => {
      if (!orderedItems[order.item]) orderedItems[order.item] = 0;
      if (order.number) orderedItems[order.item] += order.number;
    });

    let querySnapshot = await loadDataDB("categories");
    querySnapshot.forEach((doc) => {
      categories[doc.id] = doc.title;
    });

    let where = null;
    if (category) {
      const catId = Object.keys(categories).find((c) => categories[c] === category);
      where = where("category", "==", catId);
    }
    querySnapshot = await loadDataDB("items");
    // console.log(orderedItems);
    // querySnapshot.forEach((item) => {
    //   if (orderedItems[item.id]) item.number -= orderedItems[item.id];
    // });
    setItems(querySnapshot);
  };

  useEffect(() => {
    loadData();

    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
    return () => {
      orderedItems = null;
    };
  }, []);

  const onAdd = (product) => {
    const alreadyAdded = addedItems.find((item) => item.id === product.id);
    let newItems = [];

    if (alreadyAdded) {
      newItems = addedItems.filter((item) => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }

    setAddedItems(newItems);

    if (newItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice(newItems)}`,
      });
    }
  };

  return (
    <div>
      {category && (
        <div style={{ fontSize: "20px", margin: "10px" }}>
          Товары категории <span style={{ color: "#1bb3ff" }}>{category}</span>
        </div>
      )}
      {/* <div className={"list"}>
        {items.map((item) => (
          <ProductItem key={item.id} category={categories[item.category]} item={item} />
        ))}
      </div> */}
      <div>
        <Table
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate("/items/add/" + record.id);
              }, // click row
            };
          }}
          dataSource={items}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          style={{ padding: "13px", height: "50px" }}
          onClick={() => {
            navigate("/items/add");
          }}
          className="addItemButton"
        >
          Добавить товар
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
