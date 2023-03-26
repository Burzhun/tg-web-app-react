import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { db } from "./firebase/config";
import Header from "./Header";
import { Input, Button, notification } from "antd";
import "./ProductList/ProductList.css";
import "./Form/Form.css";

const CategoryItem = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [category, setCategory] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();
  const params = useParams();

  const loadData = async () => {
    if (!params.title) return;
    const querySnapshot = await loadDataDB("categories", where("title", "==", params.title));
    if (querySnapshot.length) setCategory(querySnapshot[0]);
  };

  useEffect(() => {
    loadData();

    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
  }, []);

  const openCategory = (title) => {
    navigate("/category/" + title);
  };

  const openNotification = () => {
    notification.open({
      message: "Категория обновлена",
      description: "",
      duration: 2,
    });
  };

  const saveItem = () => {
    const data = {
      title: category.title,
    };

    updateDoc(doc(db, "categories", category.id), data)
      .then((res) => {
        openNotification();
        navigate("/category/" + category.title);
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Header active="categories" />
      {category && (
        <div>
          <div>
            <Input className={"input"} type="text" value={category.title} onChange={(e) => setCategory({ ...category, title: e.target.value })} placeholder={"Название"} />
          </div>
          <br />
          <div>
            <Button
              onClick={() => {
                saveItem();
              }}
              type="primary"
            >
              Изменить название категории
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
