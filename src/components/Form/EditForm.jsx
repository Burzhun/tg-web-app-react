import React, { useCallback, useEffect, useState } from "react";
import "./Form.css";
import { Button, Input, notification, Select } from "antd";
import { useTelegram } from "../../hooks/useTelegram";
import { storage, db } from "../firebase/config";
import { collection, addDoc, query, getDocs, doc, updateDoc, getDoc, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { NavLink, useHistory, useParams } from "react-router-dom";
import Header from "../Header";

const EditForm = () => {
  const urlParams = useParams();
  const [itemId, setItemId] = useState(null);
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState("");

  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState("");
  const { tg } = useTelegram();

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    var output = document.getElementById("imagePreiview");
    setImageAsUrl(URL.createObjectURL(image));
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const loadCategories = useCallback(async () => {
    console.log(urlParams);
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    setCategoriesList(querySnapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title })));
    if (urlParams.id) {
      setItemId(urlParams.id);
      const docRef = doc(db, "items", urlParams.id);
      const docSnap = await getDoc(docRef);
      //const item = collection(db, "categories").doc(urlParams.id).get();
      console.log(docSnap.data());
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setNumber(data.number);
        if (data.category) setCategory(data.category);
        if (data.image) setImageAsUrl(data.image);
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

  const uploadItem = () => {
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      saveItem(imageAsUrl || "");
      return;
    }
    const name = "image" + Math.random().toString().slice(2, 8);
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsUrl(downloadURL);
          saveItem(downloadURL);
        });
      }
    );
  };

  const saveItem = async (imageUrl) => {
    const dbRef = collection(db, "items");
    const data = {
      title,
      number,
      category,
      image: imageUrl,
    };
    if (itemId) {
      updateDoc(doc(db, "items", itemId), data)
        .then((res) => {
          openNotification();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      addDoc(dbRef, data)
        .then((docRef) => {
          console.log("Document has been added successfully");
          openNotification();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={"form"}>
      <Header />
      <h3>Добавление товара</h3>
      <Input className={"input"} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"Название"} />
      <Input className={"input"} type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} placeholder={"Количество"} />
      <div style={{ margin: "10px 0" }}>
        <Input className={"input"} id="fileInput" onChange={handleImageAsFile} type="file" style={{ display: "none" }} />
        <img style={{ display: imageAsUrl ? "inline" : "none" }} id="imagePreiview" src={imageAsUrl} width="100" height="100" />
        <Button
          onClick={() => {
            document.getElementById("fileInput").click();
          }}
          type="link"
        >
          Добавить изображение
        </Button>
      </div>
      <div>
        <Select
          showSearch
          placeholder="Выберите категорию"
          optionFilterProp="children"
          onChange={(value) => {
            console.log(value);
            setCategory(value);
          }}
          style={{ minWidth: "100px" }}
          value={category}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          options={categoriesList.map((c) => ({ label: c.title, value: c.id }))}
        />
      </div>
      <Button
        onClick={() => {
          uploadItem();
        }}
        type="primary"
      >
        Добавить товар
      </Button>
    </div>
  );
};

export default EditForm;
