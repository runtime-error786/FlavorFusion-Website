"use client";
import React, { useEffect } from "react";
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8001/products/${id}/`, {
                withCredentials: true
            });
            console.log(`Product with ID ${id} deleted successfully`);
            await dispatch(ShowAllUser1(searchUser, sortUser, currentPage));
        } catch (error) {
            toast.error("Your session expired. Please sign out and sign in again.");
        }
    };
    
    

    return (
        <>
            <div id="container">
                <h1 style={{ textAlign: "center" }}>Delete Product</h1>
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
                                <th>Delete</th>
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
                                                <button className="del1" onClick={() => handleDelete(admin.id)}>
                                                    Delete
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
        </>
    );
};
export default AdminTable;
