"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './Style.css';
import { cart_count, Showcart } from '@/Redux/Action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

const Cart = ({ params }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const Prod = useSelector((state) => state.Record);
    const dispatch = useDispatch();
    const price = useSelector((state) => state.Price);
    const Check = useSelector((state) => state.checkbtn);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success') === 'true';
    const router = useRouter(); // Initialize useRouter

    // Function to fetch cart data
    const fetchdata = async () => {
        await dispatch(Showcart());
        const updatedProd = Prod.map(product => ({ ...product }));
        setCartItems(updatedProd);
        dispatch(cart_count());
    };

    // Fetch cart data on component mount
    useEffect(() => {
        fetchdata();
    }, []);

    // Check for payment success and delete cart items
    useEffect(() => {
        if (success && sessionId) {
            const verifyPayment = async () => {
                setLoading(true); // Show spinner
                try {
                    const response = await axios.post('http://localhost:8001/verifypay/', { sessionId }, { withCredentials: true });
                    if (response.status === 200 && response.data.payment_status === 'succeeded') {
                        await axios.delete('http://localhost:8001/cartdel/', { withCredentials: true });
                        toast.success('Payment successful! Cart items cleared.');
                        fetchdata(); // Refresh cart items
                        
                        router.push('/customer/all'); // Redirect to /customer/cart
                    } else {
                        toast.error('Payment verification failed.');
                    }
                } catch (error) {
                    console.error('Error verifying payment:', error);
                    toast.error('Error verifying payment.');
                } finally {
                  setLoading(false); // Hide spinner
                }
            };
            verifyPayment();
        }
    }, [success, sessionId]);

    // Function to add item to cart
    const addItem = (product) => {
        const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    // Function to remove item from cart
    const removeItem = async (productId) => {
        try {
            await axios.delete('http://localhost:8001/removecart', {
                data: { productId },
                withCredentials: true
            });
            fetchdata();
            dispatch(cart_count());
        } catch (error) {
            toast.error("Your session expired. Please sign out and sign in again.");
        }
    };

    // Function to increment item quantity
    const incrementQuantity = async (productId, qty) => {
        try {
            await axios.put('http://localhost:8001/updatecart/', { productId, qty }, { withCredentials: true });
            fetchdata();
        } catch (error) {
            toast.error("Your session expired. Please sign out and sign in again.");
        }
    };

    // Function to decrement item quantity
    const decrementQuantity = async (productId, qty) => {
        try {
            await axios.put('http://localhost:8001/updatecart/', { productId, qty }, { withCredentials: true });
            fetchdata();
        } catch (error) {
            toast.error("Your session expired. Please sign out and sign in again.");
        }
    };

    // Function to get total price
    const getTotalPrice = () => {
        return price;
    };

    // Checkout function
    const checkout = async () => {
        try {
            const response = await axios.post('http://localhost:8001/createcheckoutsession/', null, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log('Checkout successful');
                const stripePromise = await loadStripe('pk_test_51P0cjlP8GjJIjxDGEgyDXqRqhQThEMQl5KySJ1F7bhigoblE6MDvutJnx3n7LlTQx3HiA3zL9xYhnGwHTba03QpR00JWEq159G');
                const stripe = await stripePromise;

                const { error } = await stripe.redirectToCheckout({
                    sessionId: response.data.sessionId,
                });

                if (error) {
                    console.error(error);
                    toast.error("Failed to initiate payment. Please try again.");
                }
            } else {
                console.error('Checkout failed');
                toast.error("Checkout failed. Please try again later.");
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error("Error during checkout. Please try again.");
        }
    };

    return (
        <div className="cart-container">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div style={{width: "6rem", height: "6rem",borderWidth:"10px"}} className="spinner-border text-warning" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
            ) : (
                <>
                    <h1 className="cart-title">Shopping Cart</h1>
                    <div className="table-container">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Actual Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Prod.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.product_name}</td>
                                        <td>{item.product_price}</td>
                                        <td>
                                            <div className="quantity-container">
                                                <button
                                                    className={`quantity-button ${item.cart_qty === 1 ? 'disabled1' : ''}`}
                                                    disabled={item.cart_qty === 1}
                                                    onClick={() => decrementQuantity(item.product_id, item.cart_qty - 1)}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                {item.cart_qty}
                                                <button
                                                    className={`quantity-button ${item.cart_qty >= item.original_qty ? 'disabled1' : ''}`}
                                                    disabled={item.cart_qty === item.original_qty}
                                                    onClick={() => incrementQuantity(item.product_id, item.cart_qty + 1)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                            {item.original_qty < item.cart_qty && <div className='out1'>Out of Stock</div>}
                                        </td>
                                        <td>${item.product_price * item.cart_qty}</td>
                                        <td>
                                            <button className="remove-button" onClick={() => removeItem(item.product_id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="total-price">Total Price: ${getTotalPrice()}</div>
                    <div className="button-container">
                        <button
                            onClick={checkout}
                            disabled={Check}
                            className={`checkout-button ${Check ? 'disabled2' : ''}`}
                        >
                            Checkout
                        </button>
                    </div>
                    <Toaster />
                </>
            )}
        </div>
    );
};

export default Cart;
