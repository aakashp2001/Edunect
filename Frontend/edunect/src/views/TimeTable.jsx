import React, { useState, useEffect } from 'react'
import AdminNav from './components/AdminNav'
import axios from 'axios'
import { useLogin } from '../required_context/LoginContext'
function TimeTable() {
    const [fileState, setFileState] = useState()
    const [sem, setSem] = useState()
    const [branch, setBranch] = useState()
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const { userType } = useLogin()
    const [timetable, setTimeTable] = useState({})
    // console.log('ss',JSON.parse(localStorage.getItem('profileData')))
    // console.log(JSON.parse(localStorage.getItem('profileData')).batch)
    useEffect(() => {
        const sem = JSON.parse(localStorage.getItem('profileData')).sem
        const batch = JSON.parse(localStorage.getItem('profileData')).batch
        const formData = new FormData()
        formData.append('sem', sem)
        formData.append('batch', batch)
        axios({
            url: 'http://127.0.0.1:8000/scheduler/get_time_table', method: 'post',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                const arr = response.data.data;
                setTimeTable(arr);
                console.log('ss', response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    if (userType === 'student') {
        return (
            <>

            </>
        );

    } else {
        async function handleFileChange(e) {
            await setFileState(e.target.files[0])
            // console.log(e.target.files);

            // console.log(fileState);

        }
        const handleSubmit = (e) => {
            e.preventDefault()
            const formData = new FormData();
            formData.append('sem', sem);
            formData.append('branch', branch)
            formData.append('file', fileState)

            // console.log(formData);

            // fetch('http://127.0.0.1:8000/scheduler/upload_timetable', {
            //     method: 'POST',
            //     body: formData,
            // }).then(res => {
            //     console.log(res)
            //     if (res.message) {
            //         console.log("less go", res.message);
            // setSuccessMessage("TimeTable created Successfully")
            //     } if (res.error) {
            //         setErrorMessage(res.error)
            //     }
            // })
            //     .catch(error => {
            //         setErrorMessage(error.error)

            //     })
            axios({
                method: "post",
                url: "http://127.0.0.1:8000/scheduler/upload_timetable",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((res) => {
                    console.log(res);
                    setSuccessMessage("TimeTable created Successfully")

                })
        }
        return (
            <div>
                <AdminNav />
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
                        <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="defaultPassword" className="block text-sm text-gray-700 mt-3 font-bold">
                                    Enter Document Title
                                </label>
                                <input type="number" name="sem" id="sem" placeholder='Enter Sem' onChange={async (e) => { await setSem(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <input type="text" name="branch" id="branch" placeholder='Enter Branch' onChange={async (e) => { await setBranch(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <div className="mt-1">
                                    {/* <input id="signup_file" name="signup_file" type="file" required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                                    <label className="text-base font-semibold mb-2 block">Upload file</label>
                                    <input type="file" onChange={handleFileChange}
                                        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" accept='.xlsx' />
                                    <p className="text-xs text-gray-400 mt-2">excel only Allowed.</p>

                                </div>
                                <div>
                                    <button type="submit" className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                                        Submit
                                    </button>
                                    <p className='text-red-700 bg-red-200'>{errorMessage}</p>
                                    <p className='text-green-800 rounded-md px-1 text-center bg-green-200'>{successMessage}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

    }

}

export default TimeTable