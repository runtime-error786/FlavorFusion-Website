import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Style.css'; // Import the custom CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CustomNavbar = () => {
    const [imageURL, setImageURL] = useState(null);

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
        <nav className="navbar fixed-top custom-navbar">
            <div className="container-fluid">
                <a className="navbar-brand custom-brand" href="#">Flavour Fusion</a>
                <div className="d-flex align-items-center">
                    <a className="nav-link" href="#">
                        {imageURL ? (
                            <img src={imageURL} alt="User Profile" className="profile-img" />
                        ) : (
                            <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-icon" />
                        )}
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="offcanvas offcanvas-end custom-offcanvas" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title custom-brand" id="offcanvasDarkNavbarLabel">Flavour Fusion</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </a>
                                <ul className="dropdown-menu custom-dropdown">
                                    <li><a className="dropdown-item" href="#">Burger</a></li>
                                    <li><a className="dropdown-item" href="#">Pasta</a></li>
                                    <li><a className="dropdown-item" href="#">Pizza</a></li>
                                    <li><a className="dropdown-item" href="#">Drink</a></li>
                                    <li><a className="dropdown-item" href="#">Others</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Cart</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Sign Out</a>
                            </li>
                        </ul>
                        <form className="d-flex mt-3" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-success custom-search-btn" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomNavbar;
