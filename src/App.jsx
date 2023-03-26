import "./App.css";
import React, { useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import Form from "./components/Form/Form";
import CategoryForm from "./components/Form/CategoryForm";
import Categories from "./components/Categories";
import CategoryItem from "./components/CategoryItem";
import BottomMenu from "./components/BottomMenu/BottomMenu";
import OrdersList from "./components/Orders/Orders";
import OrderForm from "./components/Orders/OrderForm";
import UnitForm from "./components/UnitForm";
import Units from "./components/Units";
import Accounts from "./components/Accounts";
import Accountform from "./components/AccountForm";
import { loadDataDB } from "./components/firebase/config";

function App() {
  const { onToggleButton, tg, user, queryId } = useTelegram();
  const [role, setRole] = useState("");

  const loadData = async () => {
    const roles = await loadDataDB("roles");
    const role = roles.find((r) => r.user_ids.includes(user.username));
    if (role) setRole(role.role);
    else tg.close();
  };

  useEffect(() => {
    tg.ready();
    loadData();
  }, []);

  return role ? (
    <div className="App">
      <BottomMenu>
        <Header />
        <Routes>
          <Route path={"items/"} element={<ProductList />} />
          <Route path={"items/:category"} element={<ProductList />} />
          <Route path={"items/add"} element={<Form />} />
          <Route path={"items/add/:id"} element={<Form />} />
          {role === "admin" && (
            <React.Fragment>
              <Route path={"orders/"} element={<OrdersList />} />
              <Route path={"orders/add"} element={<OrderForm />} />
              <Route path={"orders/:id"} element={<OrderForm />} />

              <Route path={"categories/"} element={<Categories />} />
              <Route path={"category/:title"} element={<CategoryItem />} />
              <Route path={"category/add"} element={<CategoryForm />} />
              <Route path={"category/add/:id"} element={<CategoryForm />} />
              <Route path={"units/"} element={<Units />} />
              <Route path={"units/add"} element={<UnitForm />} />
              <Route path={"units/add/:id"} element={<UnitForm />} />
              <Route path={"/roles"} element={<Accounts />} />
              <Route path={"/roles/add"} element={<Accountform />} />
              <Route path={"/roles/add/:id"} element={<Accountform />} />
            </React.Fragment>
          )}
        </Routes>
      </BottomMenu>
    </div>
  ) : (
    <div></div>
  );
}

export default App;
