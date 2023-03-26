import "./App.css";
import { useEffect } from "react";
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

function App() {
  const { onToggleButton, tg, user, queryId } = useTelegram();
  console.log(tg, user, queryId);

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <BottomMenu>
        <Header />
        {JSON.stringify(user)}
        <Routes>
          <Route path={"orders/"} element={<OrdersList />} />
          <Route path={"orders/add"} element={<OrderForm />} />
          <Route path={"orders/:id"} element={<OrderForm />} />
          <Route path={"items/"} element={<ProductList />} />
          <Route path={"items/:category"} element={<ProductList />} />
          <Route path={"items/add"} element={<Form />} />
          <Route path={"items/add/:id"} element={<Form />} />
          <Route path={"categories/"} element={<Categories />} />
          <Route path={"category/:title"} element={<CategoryItem />} />
          <Route path={"category/add"} element={<CategoryForm />} />
          <Route path={"category/add/:id"} element={<CategoryForm />} />
          <Route path={"units/"} element={<Units />} />
          <Route path={"units/add"} element={<UnitForm />} />
          <Route path={"units/add/:id"} element={<UnitForm />} />
        </Routes>
      </BottomMenu>
    </div>
  );
}

export default App;
