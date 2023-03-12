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

function App() {
  const { onToggleButton, tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path={"items/"} element={<ProductList />} />
        <Route path={"items/:category"} element={<ProductList />} />
        <Route path={"items/add"} element={<Form />} />
        <Route path={"items/add/:id"} element={<Form />} />
        <Route path={"categories/"} element={<Categories />} />
        <Route path={"category/:title"} element={<CategoryItem />} />
        <Route path={"category/add"} element={<CategoryForm />} />
        <Route path={"category/add/:id"} element={<CategoryForm />} />
      </Routes>
    </div>
  );
}

export default App;
