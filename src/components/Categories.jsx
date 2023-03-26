import React, { useState } from "react";
import "./ProductList/ProductList.css";
import { useTelegram } from "../hooks/useTelegram";
import { useCallback, useEffect } from "react";
import { loadDataDB } from "./firebase/config";
import Header from "./Header";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Categories = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();

  const loadData = async () => {
    setCategories(await loadDataDB("categories"));
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

  return (
    <div>
      <Header active="categories" />
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            navigate("/category/add");
          }}
          className="addCategoryButton"
        >
          Добавить категорию
        </Button>
      </div>
      <div className={"list"}>
        {categories.map((category) => (
          <div>
            <div onClick={() => navigate("/items/" + category.title)} className="categoryItem">
              {category.title}
            </div>
            <EditOutlined
              onClick={() => {
                openCategory(category.title);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
