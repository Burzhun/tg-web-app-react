import React from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function BottomMenu({ children }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bottomContainer" style={{ marginBottom: "70px" }}>
        {children}
      </div>
      <div id="bottomMenu">
        <div
          className="menu"
          onClick={() => {
            navigate("/orders");
          }}
        >
          Заказы
        </div>
        <div
          className="menu"
          onClick={() => {
            navigate("items/");
          }}
        >
          Склад
        </div>
        <div
          className="menu"
          onClick={() => {
            navigate("categories/");
          }}
        >
          Номенклатура
        </div>
        <div className="menu">Аккаунты</div>
      </div>
    </div>
  );
}

export default BottomMenu;
