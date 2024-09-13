import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLogin } from '../../required_context/LoginContext';

function UserProfile() {
    const [profileData, setProfileData] = useState(() => {
        const storedProfileData = localStorage.getItem('profileData');
        try {
            return storedProfileData ? JSON.parse(storedProfileData) : null;
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
            return null;
        }
    });
        const [errorMessage, setErrorMessage] = useState(null);
    const {username} = useLogin()
    // Fetch profile data if it's not available in localStorage
    useEffect(() => {
        if (!profileData) {
            axios.get(`http://127.0.0.1:8000/account/getProfile/${username}`)
                .then(response => {
                    if (response.data.resp === 1) {
                        setProfileData(response.data.data[0]);
                        console.log(response.data)
                        localStorage.setItem('profileData', JSON.stringify(response.data.data[0])); // Store in localStorage
                    } else {
                        setErrorMessage('Failed to fetch profile data');
                    }
                })
                .catch(error => {
                    setErrorMessage('Error fetching data: ' + error.message);
                });
        }
    }, [profileData]);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('profileData'); // Clear profile data from localStorage
        setProfileData(null); // Clear the state
        // You may redirect the user to login page or handle logout logic here
    };

    if (errorMessage) {
        return <div className="text-red-500">{errorMessage}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Student Profile</h2>
                <div className="text-gray-700">
                    <p><span className="font-bold">Username:</span> {profileData.username}</p>
                    <p><span className="font-bold">Full Name:</span> {profileData.full_name || 'N/A'}</p>
                    <p><span className="font-bold">Email:</span> {profileData.email}</p>
                    <p><span className="font-bold">Branch:</span> {profileData.branch}</p>
                    <p><span className="font-bold">Sem:</span> {profileData.sem}</p>
                    <p><span className="font-bold">Batch:</span> {profileData.batch}</p>
                    <p><span className="font-bold">Roll No:</span> {profileData.roll_no}</p>
                    {/* <p><span className="font-bold">User Type:</span> {profileData.user_type}</p> */}
                    {/* <p><span className="font-bold">Active:</span> {profileData.is_active ? 'Yes' : 'No'}</p> */}
                    <p><span className="font-bold">Joined:</span> {new Date(profileData.date_joined).toLocaleDateString()}</p>
                </div>
                <button 
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
