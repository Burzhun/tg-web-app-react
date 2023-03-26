import React, { useCallback, useEffect, useState } from "react";
import "./Form/Form.css";
import { Button, Input, notification, Select } from "antd";
import { useTelegram } from "../hooks/useTelegram";
import { loadDataDB, db } from "./firebase/config";
import { collection, addDoc, doc, updateDoc, where } from "firebase/firestore";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

const Accountform = () => {
  const urlParams = useParams();
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [role, setRole] = useState("");

  const { tg } = useTelegram();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (urlParams.id) {
      const list = await loadDataDB("roles");
      let roles = [];
      list.forEach((t) => {
        t.user_ids.forEach((id) => {
          if (id === urlParams.id) setRole(t.role);
        });
      });
      setUserName(urlParams.id);
    }
  };

  const saveItem = () => {
    const dbRef = collection(db, "unit");
    const data = {
      name: username,
    };
    addDoc(dbRef, data)
      .then((docRef) => {
        console.log("Document has been added successfully");
        openNotification();
      })
      .catch((error) => {});
  };

  const addUser = async () => {
    const list = await loadDataDB("roles");
    list.forEach((r) => {
      if (r.role === role) {
        const ids = r.user_ids;
        ids.push(username);
        const data = {
          user_ids: ids,
        };
        updateDoc(doc(db, "roles", r.id), data)
          .then((res) => {
            openNotification();
            navigate("/roles/");
          })
          .catch((error) => {});
      } else {
        if (r.user_ids.includes(username)) {
          const data = {
            user_ids: r.user_ids.filter((id) => id !== username),
          };
          updateDoc(doc(db, "roles", r.id), data)
            .then((res) => {
              navigate("/roles/");
            })
            .catch((error) => {});
        }
      }
    });
  };

  const openNotification = () => {
    notification.open({
      message: "Пользователь добавлен",
      description: "",
      duration: 2,
    });
  };

  const deleteUser = async () => {
    const list = await loadDataDB("roles");
    list.forEach((r) => {
      if (r.user_ids.includes(username)) {
        const data = {
          user_ids: r.user_ids.filter((id) => id !== username),
        };
        updateDoc(doc(db, "roles", r.id), data)
          .then((res) => {
            navigate("/roles/");
          })
          .catch((error) => {});
      }
    });
  };

  return (
    <div>
      <Header active={"units"} />
      <div className={"form"}>
        <h3>Добавление пользователя</h3>
        <div>
          <Select
            showSearch
            placeholder="Выберите роль"
            optionFilterProp="children"
            onChange={(value) => {
              setRole(value);
            }}
            style={{ minWidth: "100px" }}
            value={role}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={[
              { label: "Админ", value: "admin" },
              { label: "Менеджер", value: "manager" },
            ].map((c) => c)}
          />
        </div>
        <div>{urlParams.id ? <div>{urlParams.id}</div> : <Input className={"input"} type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder={"Ник"} />}</div>

        <div>
          <Button
            onClick={() => {
              addUser();
            }}
            type="primary"
          >
            Добавить пользователя
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              deleteUser();
            }}
            danger
            type="primary"
          >
            Удалить пользователя
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Accountform;
