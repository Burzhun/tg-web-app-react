import React from "react";
import "./Header.css";
import { useNavigate, useParams } from "react-router-dom";

function Header({ active }) {
  const navigate = useNavigate();

  return (
    <div className="header2">
      <span key="headerItems" onClick={() => navigate("/items/")} className={"headerItem " + (active === "items" ? "active" : "")}>
        Товары
      </span>
      <span key="headerCategories" onClick={() => navigate("/categories/")} className={"headerItem " + (active === "categories" ? "active" : "")}>
        Категории
      </span>
    </div>
  );
}

export default Header;
