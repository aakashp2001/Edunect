import React, { useState } from 'react'
import { useLogin } from '../required_context/LoginContext'
function ChangePassword() {
    const {username,updateFirstTime,logout} = useLogin()
    const [password,setPassword] = useState("")
    const [currentPassword,setCurrentPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage,setErrorMessage] = useState('')
    
    function CheckPassword(password) {
        // Define regex parts for different criteria
        var hasDigit = /\d/;                  // Must contain at least one digit
        var hasLowerCase = /[a-z]/;           // Must contain at least one lowercase letter
        var hasUpperCase = /[A-Z]/;           // Must contain at least one uppercase letter
        var hasSpecialChar = /[^a-zA-Z0-9]/;  // Must contain at least one special character
        var hasNoSpaces = /^\S*$/;            // Must not contain spaces
        var lengthValid = /^.{8,15}$/;        // Length must be between 8 and 15 characters
    
        // Check each condition and provide specific error messages
        if (!hasDigit.test(password)) {
            setErrorMessage('Password must contain at least one digit.');
            return false;
        } 
        if (!hasLowerCase.test(password)) {
            setErrorMessage('Password must contain at least one lowercase letter.');
            return false;
        }
        if (!hasUpperCase.test(password)) {
            setErrorMessage('Password must contain at least one uppercase letter.');
            return false;
        }
        if (!hasSpecialChar.test(password)) {
            setErrorMessage('Password must contain at least one special character.');
            return false;
        }
        if (!hasNoSpaces.test(password)) {
            setErrorMessage('Password must not contain any spaces.');
            return false;
        }
        if (!lengthValid.test(password)) {
            setErrorMessage('Password must be between 8 and 15 characters long.');
            return false;
        }
    
        // If all checks pass
        return true;
    }
    const handlePasswordChange=(e)=>{
        e.preventDefault()   
        console.log(CheckPassword(password));
        if(CheckPassword(password) && (password === confirmPassword)){
            fetch('http://127.0.0.1:8000/account/passChange',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username':username,
                    'current_password':currentPassword,
                    "new_password":password
                })
            }).then(response => response.json())
            .then(data=>{
                console.log(data)
                if(data.resp === 0){
                    setErrorMessage(data.message)
                }else{
                    updateFirstTime(false)
                    logout()
                }
            })
        }
    }
    return (
        <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Change Password
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                
                <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:rounded-lg sm:px-10">
                <p className='my-2 mb-5 font-bold'>This will show up one time only set up new password for your account</p>

                    <form className="space-y-6" onSubmit={handlePasswordChange}>
                    <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Enter Current Password:
                            </label>
                            <div className="mt-1">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter Current Password"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Enter New Psasword:
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter New Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className='text-red-500 text-sm'>Password must have 8-15 characters, one uppercase, one digit and one special characters (!,?,*)</p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Change Password
                            </button>
                            <div className='text-red-700 text-center rounded-md bg-red-100 '>
                                {errorMessage}

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword