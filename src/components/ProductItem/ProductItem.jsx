import React, { useState } from "react";
import Button from "../Button/Button";
import "./ProductItem.css";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

const ProductItem = ({ item, category }) => {
  const [number, setNumber] = useState(item.number);
  const navigate = useNavigate();
  const onAddHandler = () => {
    onAdd(product);
  };

  const updateNumber = (e, number) => {
    e.stopPropagation();
    const data = {
      number,
    };

    updateDoc(doc(db, "items", item.id), data)
      .then((res) => {
        setNumber(number);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div
        className={"item"}
        onClick={(e) => {
          console.log(e.target);
          navigate("/items/add/" + item.id);
        }}
      >
        <div className={"product"}>
          <div className="item-image">
            <div className="imageContainer">
              <img src={item.image || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"} />
            </div>
          </div>
          <div className="item-container">
            <div className={"title"}>{item.title}</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate("/items/" + category);
              }}
              className={"category"}
            >
              {category}
            </div>
            <div className="counter">
              <div
                onClick={(e) => {
                  updateNumber(e, number - 1);
                }}
                className="minus"
              >
                -
              </div>
              <div className={"number"}>{number}</div>
              <div
                onClick={(e) => {
                  updateNumber(e, number + 1);
                }}
                className="plus"
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
