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
    const [profileButtonVal, setProfileButtonVal] = useState('Show Profile')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { username } = useLogin()
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

    const handleLogout = () => {
        localStorage.removeItem('profileData'); // Clear profile data from localStorage
        setProfileData(null); // Clear the state
    };

    if (errorMessage) {
        return <div className="text-red-500">{errorMessage}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }


    const toggleModal = () => {
        if (profileButtonVal === 'Show Profile') {
            setProfileButtonVal('Hide Profile');
            setIsModalOpen(true);
        } else {
            setProfileButtonVal('Show Profile');
            setIsModalOpen(false);
        }
    };

    const closeUserProfile = () => {
        setProfileButtonVal('Show Profile');
        setIsModalOpen(false);
    };

    return (
        <div>
            <button
                type="button"
                className="font-medium flex flex-col p-2 pb-4 lg:p-0 border border-gray-100 rounded-lg bg-gray-100 lg:flex-row lg:space-x-8 rtl:space-x-reverse lg:mt-0 lg:border-0 lg:w-100"
                onClick={toggleModal}
            >
                <i className="bi bi-person-circle">
                {' '+profileButtonVal}
                </i>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold text-blue-600 mb-4">Student Profile</h2>
                        <div className="text-gray-700">
                            <p><span className="font-bold">Username: {profileData.username}</span></p>
                            <p><span className="font-bold">Full Name: {profileData.full_name || 'N/A'}</span></p>
                            <p><span className="font-bold">Email: {profileData.email}</span></p>
                            <p><span className="font-bold">Branch: {profileData.branch}</span></p>
                            <p><span className="font-bold">Sem: {profileData.sem}</span></p>
                            <p><span className="font-bold">Batch: {profileData.batch}</span></p>
                            <p><span className="font-bold">Roll No: {profileData.roll_no}</span></p>
                            <p><span className="font-bold">Joined: {new Date(profileData.date_joined).toLocaleDateString()}</span></p>
                        </div>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            onClick={closeUserProfile}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
           
        </div>
    )
    
}

export default UserProfile;
