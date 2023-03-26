import React, { useState } from "react";
import "./ProductList/ProductList.css";
import { useTelegram } from "../hooks/useTelegram";
import { useCallback, useEffect } from "react";
import { loadDataDB } from "./firebase/config";
import Header from "./Header";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Units = () => {
  const [units, setUnits] = useState([]);
  const { tg, queryId } = useTelegram();
  const navigate = useNavigate();

  const loadData = async () => {
    setUnits(await loadDataDB("unit"));
  };

  useEffect(() => {
    loadData();

    // tg.onEvent("mainButtonClicked", onSendData);
    // return () => {
    //   tg.offEvent("mainButtonClicked", onSendData);
    // };
  }, []);

  const openCategory = (id) => {
    navigate("/units/add/" + id);
  };

  return (
    <div>
      <Header active="units" />
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            navigate("/units/add");
          }}
          className="addCategoryButton"
        >
          Добавить ед. изм.
        </Button>
      </div>
      <div className={"list"}>
        {units.map((unit) => (
          <div>
            <div className="categoryItem">{unit.name}</div>
            <EditOutlined
              onClick={() => {
                openCategory(unit.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Units;
