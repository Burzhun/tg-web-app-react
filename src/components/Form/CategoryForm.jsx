import React, { useCallback, useEffect, useState } from "react";
import "./Form.css";
import { Button, Input, notification } from "antd";
import { useTelegram } from "../../hooks/useTelegram";
import { storage, db } from "../firebase/config";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { NavLink, useHistory, useParams } from "react-router-dom";
import Header from "../Header";

const CategoryForm = () => {
  const urlParams = useParams();
  const [categoryId, setCategoryId] = useState(null);
  const [title, setTitle] = useState("");

  const { tg } = useTelegram();

  useEffect(() => {
    if (urlParams.id) {
      setCategoryId(urlParams.id);
      const docRef = doc(db, "categories", urlParams.id);
      getDoc(docRef).then((docSnap) => {
        //const item = collection(db, "categories").doc(urlParams.id).get();
        console.log(docSnap.data());
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
        }
      });
    }
  }, []);

  const saveItem = () => {
    const dbRef = collection(db, "categories");
    const data = {
      title,
    };
    addDoc(dbRef, data)
      .then((docRef) => {
        console.log("Document has been added successfully");
        openNotification();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openNotification = () => {
    notification.open({
      message: "Категория добавлена",
      description: "",
      duration: 2,
    });
  };

  return (
    <div>
      <Header />
      <div className={"form"}>
        <h3>Добавление категории</h3>
        <div>
          <Input className={"input"} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"Название"} />
        </div>
        <div>
          <Button
            onClick={() => {
              saveItem();
            }}
            type="primary"
          >
            Добавить категорию
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
