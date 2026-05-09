import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    id: "",
    name: "",
    descrption: "",
    quantity: "",
    price: "",
  });

  // FETCH DATA
  useEffect(() => {
    fetch(`${API}/product`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // DELETE
  const deleteProduct = (id) => {
    fetch(`${API}/product?id=${id}`, {
      method: "DELETE",
    }).then(() => {
      setProducts(products.filter((p) => p.id !== id));
    });
  };

  // OPEN ADD
  const openAdd = () => {
    setForm({
      id: "",
      name: "",
      descrption: "",
      quantity: "",
      price: "",
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // OPEN EDIT
  const openEdit = (p) => {
    setForm(p);
    setIsEditing(true);
    setShowModal(true);
  };

  // SAVE PRODUCT
  const saveProduct = () => {
    if (isEditing) {
      fetch(`${API}/product?id=${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(form.id),
          name: form.name,
          descrption: form.descrption,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      }).then(() => {
        setProducts(products.map((p) => (p.id === form.id ? form : p)));
        setShowModal(false);
      });
    } else {
      fetch(`${API}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(form.id),
          name: form.name,
          descrption: form.descrption,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts([...products, data]);
          setShowModal(false);
        });
    }
  };

  // SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Admin</h2>
        <p>Dashboard</p>
        <p className="active">Products</p>
        <p>Orders</p>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <h2>Product Dashboard</h2>

          <button className="add-btn" onClick={openAdd}>
            + Add Product
          </button>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            Total Products: {products.length}
          </div>

          <div className="card">
            Total Stock:{" "}
            {products.reduce((sum, p) => sum + p.quantity, 0)}
          </div>
        </div>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.descrption}</td>
                <td>{p.quantity}</td>
                <td>₹{p.price}</td>

                <td>
                  <button onClick={() => openEdit(p)}>
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">

            <h3>
              {isEditing ? "Edit Product" : "Add Product"}
            </h3>

            <input
              placeholder="ID"
              value={form.id}
              disabled={isEditing}
              onChange={(e) =>
                setForm({ ...form, id: e.target.value })
              }
            />

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={form.descrption}
              onChange={(e) =>
                setForm({
                  ...form,
                  descrption: e.target.value,
                })
              }
            />

            <input
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: e.target.value,
                })
              }
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />

            <button onClick={saveProduct}>
              {isEditing ? "Update" : "Add"}
            </button>

            <button onClick={() => setShowModal(false)}>
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
