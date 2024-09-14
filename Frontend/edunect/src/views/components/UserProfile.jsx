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
    const [profileButtonVal,setProfileButtonVal] = useState('Hide Profile')

    const [errorMessage, setErrorMessage] = useState(null);
    const { username } = useLogin()
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

    useEffect(()=>{
        document.getElementById('default-sidebar').style.transform = 'translateX(-100%)';
        setProfileButtonVal('Show Profile');
    },[])

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
    const closeUserProfile = () =>{
        document.getElementById('default-sidebar').style.transform = 'translateX(-100%)';
        setProfileButtonVal('Show Profile');
    }


    return (
        <div>
            <button type="button" class="font-medium flex flex-col p-4 lg:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 lg:flex-row lg:space-x-8 rtl:space-x-reverse lg:mt-0 lg:border-0  lg:w-100" onClick={
                ()=>{
                    if (profileButtonVal==='Show Profile') {
                        setProfileButtonVal('Hide Profile');
                        document.getElementById('default-sidebar').style.transform = 'translateX(0%)';

                    }
                    else {
                        document.getElementById('default-sidebar').style.transform = 'translateX(-100%)';
                        setProfileButtonVal('Show Profile');

                    }

                }
            }><i class="bi bi-person-circle"></i></button>

            <aside id="default-sidebar" className="fixed top-0 lg:top-50 left-0 z-0 transition-transform translate-x-0 w-96" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto z-0">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold text-blue-600 mb-4">Student Profile</h2>
                        <div className="text-gray-700">
                            <p><span className="font-bold">Username: {profileData.username}</span> </p>
                            <p><span className="font-bold">Full Name: {profileData.full_name || 'N/A'}</span> </p>
                            <p><span className="font-bold">Email: {profileData.email}</span> </p>
                            <p><span className="font-bold">Branch: {profileData.branch}</span></p>
                            <p><span className="font-bold">Sem: {profileData.sem}</span></p>
                            <p><span className="font-bold">Batch: {profileData.batch}</span></p>
                            <p><span className="font-bold">Roll No: {profileData.roll_no}</span></p>
                            {/* <p><span className="font-bold">User Type:</span> {profileData.user_type}</p> */}
                            {/* <p><span className="font-bold">Active:</span> {profileData.is_active ? 'Yes' : 'No'}</p> */}
                            <p><span className="font-bold">Joined: {new Date(profileData.date_joined).toLocaleDateString()}</span></p>
                        </div>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={closeUserProfile}

                        >
                            Close
                        </button>
                        
                    </div>
                </div>
            </aside>
        </div>
    )
    {/* return (
        <div className="min-h-screen bg-gray-100 sticky z-0">
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
                    <p><span className="font-bold">User Type:</span> {profileData.user_type}</p>
                    <p><span className="font-bold">Active:</span> {profileData.is_active ? 'Yes' : 'No'}</p>
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
    ); */}
}

export default UserProfile;
