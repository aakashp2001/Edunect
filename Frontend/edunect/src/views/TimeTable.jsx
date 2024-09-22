import React, { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import axios from 'axios'
import { useLogin } from '../required_context/LoginContext'
import sampleExcel from '../assets/docs/SY2_TIME_TABLE_SEM-4_Template.xlsx'

function TimeTable() {




    const [fileState, setFileState] = useState()
    const [sem, setSem] = useState()
    const [branch, setBranch] = useState()
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const { userType } = useLogin()
    const [timetable, setTimeTable] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [day, setDay] = useState()
    const [batch, setBatch] = useState()
    const [length, setLength] = useState()
    const [className, setClassName] = useState()

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    // console.log('ss',JSON.parse(localStorage.getItem('profileData')))
    // console.log(JSON.parse(localStorage.getItem('profileData')).batch)
    useEffect(() => {
        if (userType === 'student') {
            const sem = JSON.parse(localStorage.getItem('profileData')).sem
            const batch = JSON.parse(localStorage.getItem('profileData')).batch
            const formData = new FormData()
            formData.append('sem', sem)
            formData.append('batch', batch)
            axios({
                url: `http://127.0.0.1:8000/scheduler/get_time_table`, method: 'post',
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(response => {
                    const arr = JSON.parse(response.data.data);
                    // setTimeTable(JSON.parse(arr));
                    console.log(response.data)
                    try {
                        setClassName(Object.keys(arr['Class Name']).map(key => arr['Class Name'][key]))
                        setDay(Object.keys(arr['DAY']).map(key => arr['DAY'][key]))
                        setBatch(Object.keys(arr[`Batch ${batch}`]).map(key => arr[`Batch ${batch}`][key]))
                        setLength(Object.keys(arr['Class Name']).length)
                        setIsValid(true)
                        console.log(response.data.data)
                        if (response.data.data) {
                            setIsValid(true)
                        } else {
                            setIsValid(false)
                        }
                    }
                    catch (err) {
                        setIsValid(false)
                    }

                    // console.log('ss', response.data)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);


    const onButtonClick = () => {
        const link = document.createElement('a');
        link.href = sampleExcel;
        link.download = 'Student_TimeTable_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [selectedDay, setSelectedDay] = useState();
    const [lengthArr, setLengthArr] = useState([]);
    if (userType === 'student') {
        const handleDayChange = (e) => {
            if (isValid) {
                setSelectedDay(e.target.value);

                if (e.target.value === "MON") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i))  // Indexes 0 to 5
                } else if (e.target.value === "TUE") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i + 6))  // Indexes 6 to 11
                } else if (e.target.value === "WED") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i + 12)) // Indexes 12 to 17
                } else if (e.target.value === "THU") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i + 18))  // Indexes 18 to 23
                } else if (e.target.value === "FRI") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i + 24))  // Indexes 24 to 29
                } else if (e.target.value === "SAT") {
                    setLengthArr(Array.from({ length: 6 }, (_, i) => i + 30))  // Indexes 30 to 35
                }

            }

        }
        return (
            <>
                <div className='p-4 z-10'>
                    <div className="my-4">
                        <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">Select Day</label>
                        <select
                            id="day-select"
                            name="day"
                            value={selectedDay}
                            onChange={handleDayChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled selected hidden>Select Day</option>
                            {isValid ? days.map((day, index) => (
                                <option key={index} value={day}>{day}</option>
                            )) : []}
                        </select>
                    </div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 rounded-s-lg">Day</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3 rounded-e-lg">Subject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lengthArr.map((i) => (
                                    <tr key={i} className="bg-white">
                                        {
                                            <>
                                                <td className="px-6 py-4">{day[i]}</td>
                                                <td className="px-6 py-4">{className[i]}</td>
                                                <td className="px-6 py-4">{batch[i]}</td>
                                            </>
                                        }
                                    </tr>
                                ))}

                                {/* {Array.from({ length }).map((_, i) => (
                                    <tr key={i} className="bg-white">
                                    {
                                        day[i] === selectedDay && (
                                            <>
                                            <td className="px-6 py-4">{day[i]}</td>
                                            <td className="px-6 py-4">{className[i]}</td>
                                            <td className="px-6 py-4">{batch[i]}</td>
                                            </>
                                            )
                                            }
                                            </tr>
                                            ))} */}

                            </tbody>
                        </table>
                        {!(isValid) && (<p className='text-center w-100 bg-red-200 text-red-800'>Time table not uploaded yet</p>)}
                    </div>
                </div>
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

            // fetch(`http://127.0.0.1:8000/scheduler/upload_timetable`, {
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
                url: `http://127.0.0.1:8000/scheduler/upload_timetable`,
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
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Submit Timetable
                    </h2>
                    <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
                        <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="defaultPassword" className="block text-sm text-gray-700 mt-3 font-bold">
                                    Enter Document Title
                                </label>
                                <input type="number" required name="sem" id="sem" placeholder='Enter Sem' onChange={async (e) => { await setSem(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <input type="text" required name="branch" id="branch" placeholder='Enter Branch' onChange={async (e) => { await setBranch(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <div className="mt-1">
                                    {/* <input id="signup_file" name="signup_file" type="file" required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                                    <label className="text-base font-semibold mb-2 block">Upload file</label>
                                    <input type="file" onChange={handleFileChange} required
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
                        <h3 className="text-base font-semibold mb-2 block">Click on the button below to download the sample file</h3>
                        <button className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onButtonClick}>
                            Download Sample Template
                        </button>
                    </div>
                </div>
            </div>
        )

    }

}

export default TimeTable