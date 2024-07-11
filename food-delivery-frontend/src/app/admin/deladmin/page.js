"use client";
import React, { useEffect } from "react";
import "./Style.css";
import { useDispatch, useSelector } from "react-redux";
import { SearchAction, ShowAllUser, SortAction, NextPage } from "@/Redux/Action";
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
        dispatch(ShowAllUser(searchUser, sortUser, currentPage));
    }, [searchUser, sortUser, currentPage, dispatch]);

    useEffect(() => {
        dispatch(NextPage(0));
    }, [searchUser, sortUser, dispatch]);

    useEffect(() => {
        dispatch(NextPage(0));
        dispatch(SearchAction(""));
        dispatch(SortAction(false));
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:2001/DelAdmin/${id}`, {
                withCredentials: true
            });

            console.log(`User with ID ${id} deleted successfully`);
            await dispatch(ShowAllUser(searchUser, sortUser, currentPage));
            if (delAdmin.length === 1) {
                dispatch(NextPage(currentPage - 1));
            }
        } catch (error) {
            toast.error("Your session expired. Please sign out and sign in again.");
        }
    };

    return (
        <>
            <div id="container">
                <h1 style={{ textAlign: "center" }}>Delete Admin</h1>
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
                                <th>Email</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delAdmin.map((admin) => (
                                <React.Fragment key={admin.id}>
                                    <tr>
                                        <td>{admin.id}</td>
                                        <td>{admin.username}</td>
                                        <td>{admin.email}</td>
                                        <td>
                                            <button className="del1" onClick={() => handleDelete(admin.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"><hr /></td>
                                    </tr>
                                </React.Fragment>
                            ))}
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
