"use client";
import React, { useEffect, useState } from "react";
import "./Style.css";
import { useDispatch, useSelector } from "react-redux";
import { SearchAction, ShowAllUser1, SortAction, NextPage } from "@/Redux/Action";
import Pagination from "../Others/Paging";
import SearchBar from "../Others/SearchBar";
import SortControls from "../Others/Sort";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const AdminTable = () => {
    const delAdmin = useSelector((state) => state.Record);
    const searchUser = useSelector((state) => state.SearchUser);
    const sortUser = useSelector((state) => state.SortUser);
    const currentPage = useSelector((state) => state.Next);
    const totalPageCount = useSelector((state) => state.Totalpage);
    const dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(ShowAllUser1(searchUser, sortUser, currentPage));
    }, [searchUser, sortUser, currentPage, dispatch]);

    useEffect(() => {
        dispatch(NextPage(1));
    }, [searchUser, sortUser, dispatch]);

    useEffect(() => {
        dispatch(NextPage(1));
        dispatch(SearchAction(""));
        dispatch(SortAction(false));
    }, [dispatch]);

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProduct(null);
    };

    const handleUpdate = async () => {
        try {
            const { id, name, price, quantity, description, category } = selectedProduct;
            await axios.put(`http://localhost:8001/products/${id}/`, { name, price, quantity, description, category }, {
                withCredentials: true
            });
            console.log(`Product with ID ${id} updated successfully`);
            await dispatch(ShowAllUser1(searchUser, sortUser, currentPage));
            closeModal();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.name) {
                    toast.error(`Error: ${errorData.name.join(", ")}`);
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            } else {
                toast.error("Your session expired. Please sign out and sign in again.");
            }
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Ensure only non-negative numbers are entered for price and quantity
        if ((name === 'price' || name === 'quantity') && parseFloat(value) < 0) {
            return; // Do not update state if the value is negative
        }
    
        setSelectedProduct({
            ...selectedProduct,
            [name]: value
        });
    };
    

    return (
        <>
            <div id="container">
                <h1 style={{ textAlign: "center" }}>Update Product</h1>
                <div className="table-controls" style={{ textAlign: "center" }}>
                    <SearchBar />
                    <SortControls />
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delAdmin.length > 0 ? (
                                delAdmin.map((admin) => (
                                    <React.Fragment key={admin.id}>
                                        <tr>
                                            <td>{admin.id}</td>
                                            <td>{admin.name}</td>
                                            <td>{admin.price}</td>
                                            <td>{admin.quantity}</td>
                                            <td>
                                                <button className="del1" onClick={() => openModal(admin)}>
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="5"><hr /></td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        <div className="no-products">
                                            <strong>No products available</strong>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination />
                <Toaster />
            </div>

            {modalIsOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h2>Update Product</h2>
                        <form>
                            <label>
                                Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={selectedProduct.name}
                                onChange={handleInputChange}
                            />
                            <label>
                                Price:
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={selectedProduct.price}
                                onChange={handleInputChange}
                            />
                            <label>
                                Quantity:
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={selectedProduct.quantity}
                                onChange={handleInputChange}
                            />
                            <label>
                                Description:
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={selectedProduct.description}
                                onChange={handleInputChange}
                            />
                            <div className="button-group">
                                <button type="button" id="b1" onClick={handleUpdate}>
                                    Update
                                </button>
                                <button type="button" id="b2" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
};

export default AdminTable;
