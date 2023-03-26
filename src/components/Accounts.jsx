import React, { useState } from "react";
import "./ProductList/ProductList.css";
import { useTelegram } from "../hooks/useTelegram";
import { useCallback, useEffect } from "react";
import { loadDataDB } from "./firebase/config";
import Header from "./Header";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Accounts = () => {
  const [roles, setRoles] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();

  const loadData = async () => {
    const list = await loadDataDB("roles");
    let roles = [];
    list.forEach((t) => {
      t.user_ids.forEach((id) => {
        roles.push({ role: t.role, username: id });
      });
    });
    setRoles(roles);
  };

  useEffect(() => {
    loadData();

    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
  }, []);

  const editUser = (id) => {
    navigate("/roles/add/" + id);
  };

  return (
    <div>
      <div className={"accounts"}>
        <div className="row">
          <div className="role">Роль</div>
          <div className="username">Ник</div>
        </div>
        {roles.map((role) => (
          <div className="row">
            <div onClick={() => editUser(role.username)} className="role">
              {role.role}
            </div>
            <div onClick={() => editUser(role.username)} className="username">
              {role.username}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          onClick={() => {
            navigate("/roles/add");
          }}
          className="addCategoryButton"
          ё
        >
          Добавить пользователя
        </Button>
      </div>
    </div>
  );
};

export default Accounts;
