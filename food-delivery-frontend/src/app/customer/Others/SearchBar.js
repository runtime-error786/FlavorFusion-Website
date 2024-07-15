import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SearchAction } from "@/Redux/Action";
import "./Style.css"
const SearchBar = () => {
    const searchUser = useSelector((state) => state.SearchUser);
    const dispatch = useDispatch();

    const setSearchTerm = (e) => {
        dispatch(SearchAction(e.target.value));
    };

    return (
        <input
            type="text"
            placeholder="Search by name"
            value={searchUser}
            onChange={setSearchTerm}
            className="search-input"
        />
    );
};

export default SearchBar;
