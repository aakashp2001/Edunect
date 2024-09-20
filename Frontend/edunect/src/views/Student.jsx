import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation'
import axios from 'axios';
import PaginationPageBox from './components/PaginationPageBox';
import StudentComponent from './components/studentComponent';
import { useLogin } from "../required_context/LoginContext";
import { useNavigate } from 'react-router-dom';

function Student() {
    const [studentArray, setStudentArray] = useState([]);
    const [page, setPage] = useState(1);
    const [pageArray, setPageArray] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [searchMessage, setSeearchMessage] = useState("");
    const navigate = useNavigate()
    const PAGE_SIZE = 10;

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const get_max_page = (item_len, page_len) => {
        return Math.ceil(item_len / page_len);
    };

    const generateArray = (input) => {
        return Array.from({ length: input }, (_, index) => index + 1);
    };

    const handlePagination = (e) => {
        setPage(parseInt(e.target.value));
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        if (value === '') {
            setSearchResult([]);
            return;
        }
        const filtered = studentArray.filter((item) =>
            ['full_name', 'username', 'batch', 'branch', 'roll_no'].some(
                (key) =>
                    item[key] &&
                    item[key].toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        setPage(1);
        if (filtered.length === 0) {
            setSeearchMessage('No Data Found');
        } else {
            setSeearchMessage(``);
        }
        setSearchResult(filtered);
    }

    const handleShowAttendance=(student)=>{
        console.log(student)
        const queryParams = new URLSearchParams({ 'batch':student.batch,'sem':student.sem,'student': student.roll_no }).toString();
        // Navigate to the desired path with query string
        navigate(`/admin/get-attendance?${queryParams}`);
    }

    const handleResult = (student) =>{
        console.log(student)
        const queryParams = new URLSearchParams({'username': student.username }).toString();
        // Navigate to the desired path with query string
        navigate(`/admin/get-result?${queryParams}`);
 
    }

    useEffect(() => {
        axios.post(`http://127.0.0.1:8000/account/getStudents`)
            .then(response => {
                const arr = response.data.data;
                setStudentArray(arr);
                const maxPages = get_max_page(arr.length, PAGE_SIZE);
                setPageArray(generateArray(maxPages));
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-4 bg-blue-100 shadow-md">
                <div className="flex justify-center">
                    <div className="relative w-full max-w-lg">
                        <input 
                            type="text" 
                            className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Search students..." 
                            onChange={handleSearch} 
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i className="bi bi-search"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <p className='text-center text-red-500 font-semibold'>{searchMessage}</p>

                <div className="space-y-4">
                    {paginate((searchResult.length > 0 ? searchResult : studentArray), PAGE_SIZE, page).map((student, index) => (
                        <div key={index} className="bg-white shadow-md p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-blue-700">{student.full_name}</h3>
                            <p className="text-sm text-gray-700">
                                <span className="font-bold">Username:</span> {student.username}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-bold">Batch:</span> {student.batch}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-bold">Branch:</span> {student.branch}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-bold">Roll No:</span> {student.roll_no}
                            </p>
                            <button onClick={()=>{handleShowAttendance(student)}}>Show Attendence</button>
                            <button onClick={()=>{handleResult(student)}}>Show Result</button>

                        </div>
                    ))} 
                </div>
            </div>

            <div className="p-4 flex items-center justify-center">
                <nav>
                    <ul className="inline-flex space-x-2">
                        {pageArray.map((item, index) => (
                            <li key={index}>
                                <PaginationPageBox 
                                    pageNo={item} 
                                    handler={handlePagination} 
                                    className="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white"
                                />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Student;
