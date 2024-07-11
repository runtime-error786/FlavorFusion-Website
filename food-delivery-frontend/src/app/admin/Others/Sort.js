import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SortAction } from "@/Redux/Action";

const SortControls = () => {
    const sortUser = useSelector((state) => state.SortUser);
    const dispatch = useDispatch();

    const toggleSort = () => {
        dispatch(SortAction(!sortUser));
    };

    return (
        <button onClick={toggleSort} className="sort-button">
            {sortUser ? "Sort Descending" : "Sort Ascending"}
        </button>
    );
};

export default SortControls;
