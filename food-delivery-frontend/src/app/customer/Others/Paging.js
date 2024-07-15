import React from "react";
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from "@/Redux/Action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretRight, faCaretLeft
} from "@fortawesome/free-solid-svg-icons";
import "./Style.css"
const Pagination = () => {
    const currentPage = useSelector((state) => state.Next); // Assuming state.Next holds current page number
    const totalPageCount = useSelector((state) => state.Totalpage); // Assuming state.Totalpage holds total page count
    const dispatch = useDispatch();

    const handlePageChange = ({ selected }) => {
        // `selected` is the 0-based index of the selected page
        // Dispatch NextPage action with selected + 1 to adjust for 1-based page count
        dispatch(NextPage(selected + 1));
    };

    return (
        <ReactPaginate
            pageCount={totalPageCount}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={currentPage - 1} // Adjust to 0-based index for `react-paginate`
            renderOnZeroPageCount={null}
            nextLabel={<FontAwesomeIcon size="xl" icon={faCaretRight} />}
            previousLabel={<FontAwesomeIcon size="xl" icon={faCaretLeft} />}
            itemClassPrev={"prev"}
            itemClassNext={"next"}
        />
    );
};

export default Pagination;
