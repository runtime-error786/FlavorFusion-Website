"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get('http://localhost:8001/img/', {
                    withCredentials: true // Include credentials if needed for authentication
                });
                console.log(response)
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
        <div>
            {imageURL ? (
                <img src={imageURL} alt="User Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
