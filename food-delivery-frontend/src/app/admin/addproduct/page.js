"use client"
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import "./Style.css"

const Add_product = () => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [qty, setQty] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSubmit = async () => {
        if (!name  || !qty || !price || !description || !image || !category) {
            toast.error("Please fill in all fields");
            return;
        }

        if (qty <= 0 || price <= 0) {
            toast.error("Quantity and price must be greater than 0");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", qty);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("picture", image);

            let response = await axios.post('http://localhost:8001/products/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                }
            });
            toast.success(response.data.message);
            setName("");
            setCompany("");
            setQty("");
            setPrice("");
            setDescription("");
            setImage(null);
            setCategory("");
            setUploadProgress(0);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error === "Product already exists") {
                toast.error("Product already exists");
            } else {
                toast.error("Your session has expired. Please sign out and sign in again.");
            }
        }
    };

    return (
        <>
        <div className="login-container">
            <h2>Add Product</h2>
            <form>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
               
                <div className="input-container">
                    <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <input
                        type="number"
                        placeholder="Price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <textarea
                        placeholder="Description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ height: "40px", borderRadius: "7px", width: "100%", marginLeft: "2px" }}
                    />
                </div>
                <div className="input-container">
                    <div className="btn-group dropdown-container">
                        <button
                            type="button"
                            className="btn dropdown-toggle custom-dropdown dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {category ? category : "Select Category"}
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Drink")}>
                                    Drink
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Burger")}>
                                    Burger
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Pizza")}>
                                    Pizza
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Pasta")}>
                                    Pasta
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Sandwich")}>
                                    Sandwich
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => setCategory("Dessert")}>
                                    Dessert
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="input-container" style={{ textAlign: "center" }}>
                    <label htmlFor="imageInput" className="custom-file-upload">
                        Pick Image
                    </label>
                    <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        required
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                            if (e.target.files[0]) {
                                setUploadProgress(100);
                            } else {
                                setUploadProgress(0);
                            }
                        }}
                    />
                </div>
                {uploadProgress > 0 && (
                    <div className="progress-container">
                        <progress value={uploadProgress} max="100" />
                    </div>
                )}
                <button id="add1" onClick={(e) => {
                    handleSubmit();
                    e.preventDefault();
                }}>
                    Add Product
                </button>
            </form>
            <Toaster />
        </div>
    </>
    );
};

export default Add_product;