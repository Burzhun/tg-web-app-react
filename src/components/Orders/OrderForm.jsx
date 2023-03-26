import React, { useCallback, useEffect, useState } from "react";
import "./Form.css";
import { Button, Input, notification, Select } from "antd";
import { useTelegram } from "../../hooks/useTelegram";
import { loadDataDB, db } from "../firebase/config";
import { collection, addDoc, query, getDocs, doc, updateDoc, getDoc, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { NavLink, useHistory, useParams, useNavigate } from "react-router-dom";
import Header from "../Header";

const loadRelatedData = async (table) => {
  let t = {};
  let querySnapshot = await loadDataDB(table);
  querySnapshot.forEach((doc) => {
    t[doc.id] = doc;
  });
  return t;
};
let items = {};
let units = {};
let orderNumberOrigin = 0;
let itemNumberOrigin = 0;
let usedItem = null;

const OrderForm = () => {
  const urlParams = useParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [name, setName] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState("");
  const [itemOptions, setItemOptions] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [unit, setUnit] = useState(null);
  const [number, setNumber] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");

  const updateNumber = (e, number) => {
    e.stopPropagation();
    if (usedItem && number > usedItem.number) return;
    setNumber(number);
  };

  const loadItems = async (category) => {
    const querySnapshot = await loadDataDB("items", where("category", "==", category));
    setItemOptions(querySnapshot);
    if (selectedItem) setSelectedItem(null);
    setUnit(null);
  };

  useEffect(() => {
    if (selectedItem) {
      const item = itemOptions.find((t) => t.id === selectedItem);
      usedItem = item;
      //if (number > item.number) setNumber(item.number);
      itemNumberOrigin = item.number;
      if (item) setUnit(units[item.unit]);
    }
  }, [selectedItem]);

  const { tg } = useTelegram();

  const loadCategories = useCallback(async () => {
    setCategoriesList(await loadDataDB("categories"));

    items = await loadDataDB("items");
    units = await loadRelatedData("unit");

    if (urlParams.id) {
      setOrderId(urlParams.id);
      const docRef = doc(db, "orders", urlParams.id);
      const docSnap = await getDoc(docRef);
      //const item = collection(db, "categories").doc(urlParams.id).get();
      if (docSnap.exists()) {
        const data = docSnap.data();
        const querySnapshot = await loadDataDB("items", where("category", "==", data.category));
        setItemOptions(querySnapshot);
        if (data.category) setCategory(data.category);
        setName(data.name || "");
        setNumber(data.number);
        setOrderNumber(data.orderNumber);
        orderNumberOrigin = data.number;
        if (data.item) setSelectedItem(data.item);
      }
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openNotification = () => {
    notification.open({
      message: "Товар добавлен",
      description: "",
      duration: 2,
    });
  };

  const saveItem = async () => {
    const dbRef = collection(db, "orders");

    const data = {
      category,
      name,
      orderNumber,
      item: selectedItem,
      number,
    };
    if (orderId) {
      const itemNumberNew = itemNumberOrigin - (number - orderNumberOrigin);
      updateDoc(doc(db, "orders", orderId), data)
        .then((res) => {
          openNotification();
          updateDoc(doc(db, "items", selectedItem), { number: itemNumberNew });
        })
        .catch((error) => {});
    } else {
      addDoc(dbRef, data)
        .then((docRef) => {
          console.log("Document has been added successfully");
          updateDoc(doc(db, "items", selectedItem), { number: itemNumberOrigin - number });
          navigate("/orders/" + docRef.id);
          openNotification();
        })
        .catch((error) => {});
    }
  };

  return (
    <div className={"orderForm"}>
      <h3 style={{ padding: "5px 10px" }}>Добавление заказа</h3>
      <div className={"input"}>
        <span>Номер заказа</span>
        <Input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder={"Номер заказа"} />
      </div>
      <div className={"input"}>
        <span>Наименование заказа</span>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={"Наименование заказа"} />
      </div>

      <div className={"input"}>
        <div>Категория</div>
        <Select
          showSearch
          placeholder="Выберите категорию"
          optionFilterProp="children"
          onChange={(value) => {
            setCategory(value);
            loadItems(value);
          }}
          style={{ minWidth: "100px" }}
          value={category}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          options={categoriesList?.map((c) => ({ label: c.title, value: c.id }))}
        />
      </div>
      <div className={"input"}>
        <div>Товар</div>
        <Select
          showSearch
          placeholder="Выберите товар"
          optionFilterProp="children"
          onChange={(value) => {
            setSelectedItem(value);
          }}
          style={{ minWidth: "100px" }}
          value={selectedItem}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          options={itemOptions?.map((c) => ({ label: c.title, value: c.id }))}
        />
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
      {unit && (
        <div className={"input"}>
          <span>Единица измерения</span>
          <div>{unit.name}</div>
        </div>
      )}
      <div className={"input"}>
        <Button
          onClick={() => {
            saveItem();
          }}
          disabled={!category || !name || !orderNumber || !selectedItem}
          type="primary"
        >
          Добавить товар
        </Button>
      </div>
    </div>
  );
};

export default OrderForm;
