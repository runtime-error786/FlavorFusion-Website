"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Style.css";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus,faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { cart_count } from '@/Redux/Action';

const ProductDetails = ({ params }) => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const role = useSelector((state) => state.Rol);
    const fetchProduct = async () => {
        try {
            
            const response = await axios.get(`http://localhost:8001/products1/${params.view}`, {
               
                withCredentials: true
            });
            console.log(response.data)
            setProduct(response.data);
            setLoading(false);
            if (response.data.quantity > 0 && response.data.cartQty === 0) {
                setQuantity(1);
            } else {
                setQuantity(response.data.cartQty);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError("No product found");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [params.prod]);

    const addToCart = async (productId, quantity) => {
        try {
            console.log("call before",productId)
            let response = await axios.post('http://localhost:8001/addtocart/', { productId, quantity }, {
                withCredentials: true
            });
            await fetchProduct();
            console.log(product);
            dispatch(cart_count());
            toast.success('Successfullt updated in cart!')
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Your session expired. Please sign out and sign in again");
        }
    };

    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity <= product.quantity && newQuantity >= 0) {
            setQuantity(newQuantity);
        } else if (newQuantity < 0) {
            setQuantity(0);
        } else {
            setQuantity(product.quantity);
        }
    };

    return (
        <div className="product-details-container1">
            {error ? (
                <div className="no-product-found">No Product Found</div>
            ) : product ? (
                <div className="product-details1">
                    <div className="product-image1">
                        <img  src={`data:image/png;base64,${product.picture_base64}`}  alt={product.name} />
                    </div>
                    <div className="product-info1">
                        <h2>{product.name}</h2>
                        
                        <p>Price: ${product.price}</p>
                        <p>Description: {product.description}</p>
                        {product.quantity > 0 ? (
                            <span className="in-stock">In Stock: {product.quantity}</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                        <div className="quantity-controls1">
                            <button onClick={() => handleQuantityChange(-1)} disabled={product.quantity <= 0 || quantity <= 0}>
                                <FontAwesomeIcon
                                    size="md"
                                    icon={faMinus}
                                />
                            </button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange(1)} disabled={product.quantity <= 0 || quantity >= product.quantity}>
                            <FontAwesomeIcon
                                    size="md"
                                    icon={faPlus}
                                />
                            </button>
                        </div>
                        {product.cartQty > 0 ? (
                            <button id='j1'  onClick={() => addToCart(product.id, quantity)} disabled={product.quantity <product.cartQty  || quantity <= 0} className={(quantity <= 0 || product.quantity <quantity)  ? "button-add-to-cart disabled" : "button-add-to-cart"}>Add to Cart</button>
                        ) : (
                            <button id='j1' onClick={() => { addToCart(product.id, quantity) }} disabled={product.quantity <product.cartQty  || quantity <= 0} className={(quantity <= 0 || product.quantity <quantity)  ? "button-add-to-cart disabled" : "button-add-to-cart"}>Add to Cart</button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-product-found">No product found</div>
            )}
            <Toaster />
        </div>
    );
};

export default ProductDetails;