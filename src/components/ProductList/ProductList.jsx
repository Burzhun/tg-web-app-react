import React, { useState, useEffect } from "react";
import "./ProductList.css";
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import { db } from "../firebase/config";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import Header from "../Header";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};
let categories = {};
const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [items, setItems] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();
  const params = useParams();
  const category = params.category || "";

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    let q = query(collection(db, "categories"));
    let querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((doc) => {
      categories[doc.id] = doc.data().title;
    });

    q = query(collection(db, "items"));
    if (category) {
      const catId = Object.keys(categories).find((c) => categories[c] === category);
      console.log(catId, categories, category);
      q = query(collection(db, "items"), where("category", "==", catId));
    }
    querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadData();

    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
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
      <Header active="items" />
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            navigate("/items/add");
          }}
          className="addItemButton"
        >
          Добавить товар
        </Button>
      </div>
      <br />
      {category && (
        <div style={{ fontSize: "20px", margin: "10px" }}>
          Товары категории <span style={{ color: "#1bb3ff" }}>{category}</span>
          <CloseOutlined
            onClick={() => {
              navigate("/items/");
            }}
            style={{ color: "red", marginLeft: "10px", position: "relative", top: "2px" }}
          />
        </div>
      )}
      <div className={"list"}>
        {items.map((item) => (
          <ProductItem key={item.id} category={categories[item.category]} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
