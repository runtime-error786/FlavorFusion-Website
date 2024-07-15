"use client"
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ShowAllUser2, SearchAction, SortAction, NextPage } from "@/Redux/Action";
import SortControls from "../Others/Sort";
import Pagination from "../../admin/Others/Paging";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import "./Style.css";
import Ban from "../Banner/ban";

const Home = ({ params }) => {
  const router = useRouter();
  const Prod = useSelector((state) => state.Record);
  const SearchProd = useSelector((state) => state.SearchUser);
  const SortProd = useSelector((state) => state.SortUser);
  const currentPage = useSelector((state) => state.Next);
  const totalPageCount = useSelector((state) => state.Totalpage);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.Rol);
  console.log(params)
  useEffect(() => {
    dispatch(ShowAllUser2(SearchProd, SortProd, currentPage, params.category));
  }, [SearchProd, SortProd, currentPage, params.category]);

  useEffect(() => {
    dispatch(NextPage(1));
  }, [SearchProd, SortProd, params.category]);

  useEffect(() => {
    dispatch(NextPage(1));
    dispatch(SearchAction(""));
    dispatch(SortAction(false));
    console.log(Prod);
  }, []);

  

  const addLike = async (productId) => {
    try {
      let response = await axios.post('http://localhost:8001/like_product/', { productId }, {
        withCredentials: true
      });
      dispatch(ShowAllUser2(SearchProd, SortProd, currentPage, params.category));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Your session expired. Please sign out and sign in again.");
    }
  };

  const handleCardClick = (productId) => {
    router.push(`/customer/${params.category}/${productId}`);
  };

  return (
    <>
      {Prod.length === 0 ? (
        <div className="no-products-found">
          <p>No products found.</p>
        </div>
      ) : (
        <>
        <Ban></Ban>
          <h2 className="mt-3" style={{ textAlign: "center", fontSize: "40px" }}>Our Products</h2>
          <div className="container mb-3">
            <div className="row">
              <div style={{ textAlign: "end" }}>
                <SortControls />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              {Prod.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="product-image card-img-top">
                  <img
                    src={`data:image/png;base64,${product.picture_base64}`}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="card-img-top"
                  />
                      {product.quantity === 0 && <p className="out-of-stock-badge">Out of Stock</p>}
                      {product.quantity > 0 && <p className="in-stock-badge">In Stock</p>}
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-center flex-column align-items-center">
                        <h5 className="card-title text-center mb-3">{product.name}</h5>
                        {role !== "Guest" && (
                          <FontAwesomeIcon
                            size="xl"
                            icon={product.like ? faHeart : faHeartRegular}
                            style={{
                              color: product.like ? 'red' : 'black',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              border: '1px solid black',
                              borderRadius: '50%',
                              padding: '5px',
                              backgroundColor: 'white'
                            }}
                            onClick={() => addLike(product.id)}
                          />
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="card-title">Price: ${product.price}</p>
                        {role === "Guest" ? (
                          <button className="btn add-to-cart-btn" onClick={() => router.push("/signin")}>View</button>
                        ) : (
                          <button className="btn add-to-cart-btn" onClick={() => handleCardClick(product.id)}>View</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Toaster />
          <Pagination />
        </>
      )}
    </>
  );
};

export default Home;
