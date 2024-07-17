"use client"
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Style.css'; // Import the custom CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SearchAction } from "@/Redux/Action";

const CustomNavbar = () => {
    const [imageURL, setImageURL] = useState(null);
    const searchUser = useSelector((state) => state.SearchUser);
    const dispatch = useDispatch();
    const role = useSelector((state) => state.Rol);

    const setSearchTerm = (e) => {
        dispatch(SearchAction(e.target.value));
    };
    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get('http://localhost:8001/img/', {
                    withCredentials: true // Include credentials if needed for authentication
                });

                if (response.status === 200) {
                    if (response.data.image_url) {
                        setImageURL(response.data.image_url);
                    } else if (response.data.image_data) {
                        setImageURL(`data:image/jpeg;base64,${response.data.image_data}`);
                    } else {
                        console.error('Invalid image data received from server');
                    }
                } else {
                    console.error('Failed to fetch user image');
                }
            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        fetchUserImage();
    }, []);

    return (
        <nav className="navbar fixed-top" style={{ backgroundColor: '#ffb703' }}>
            <div className="container">
                <a className="navbar-brand custom-brand" href="/customer/all">Flavour Fusion</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel" style={{ backgroundColor: '#ffb703' }}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title custom-brand" id="offcanvasDarkNavbarLabel">Flavour Fusion</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body d-flex flex-column align-items-center">
                        <form className="d-flex mb-3 w-100" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchUser} onChange={setSearchTerm} />
                        </form>
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <a className="nav-link active " aria-current="page" href="/customer/all">Home</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </a>
                                <ul className="dropdown-menu" style={{ backgroundColor: '#ffb703' }}>
                                    <li><a className="dropdown-item" href="/customer/Burger">Burger</a></li>
                                    <li><a className="dropdown-item" href="/customer/Pasta">Pasta</a></li>
                                    <li><a className="dropdown-item" href="/customer/Pizza">Pizza</a></li>
                                    <li><a className="dropdown-item" href="/customer/Sandwich">Sandwich</a></li>
                                    <li><a className="dropdown-item" href="/customer/Dessert">Dessert</a></li>
                                </ul>
                            </li>
                            { role !== "Guest" && 
                            <li className="nav-item">
                                <a className="nav-link" href="/customer/cart">Cart</a>
                            </li>
                            }
                        </ul>
                        {role !== "Guest" &&
                            <div className="d-flex flex-column align-items-center mt-auto mb-3">
                                {imageURL ? (
                                    <a href='/customer/profile'>
                                    <img src={imageURL} alt="User Profile" className="profile-img" />
                                    </a>
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-icon" />
                                )}
                                <a className="nav-link mt-2" href="#">Sign Out</a>
                            </div>
                        }

                        {role == "Guest" &&
                            <div className="d-flex flex-column align-items-center mt-auto mb-3">
                                <a className="nav-link mt-2" href="/signin">Sign In</a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomNavbar;
