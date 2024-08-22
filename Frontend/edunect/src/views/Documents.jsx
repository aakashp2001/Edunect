import React, { useState } from 'react'
import { useLogin } from '../required_context/LoginContext'
import AdminNav from './components/AdminNav'
function Documents() {
    const [fileState, setFileState] = useState()
    const [title, setTitle] = useState()
    const handleFileChange = (e) => {
        setFileState(e.target.files[0])
    }
    return (
        <div>
        <AdminNav/>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Add Documents
                </h2>

            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
                    <form method="POST" className="space-y-6">
                        <div>
                        <label htmlFor="defaultPassword" className="block text-sm text-gray-700 mt-3 font-bold">
                                    Enter Document Title
                                </label>
                                <input type="text" name="defaultPassword" id="defaultPassword" onChange={(e) => { setTitle(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                            <div className="mt-1">
                                {/* <input id="signup_file" name="signup_file" type="file" required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                                <label className="text-base font-semibold mb-2 block">Upload file</label>
                                <input type="file" onChange={handleFileChange}
                                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" accept='.pdf' />
                                <p className="text-xs text-gray-400 mt-2">pdf only Allowed.</p>
                               
                            </div>
                            <div>
                                <button type="submit" className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                                    Submit
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Documents