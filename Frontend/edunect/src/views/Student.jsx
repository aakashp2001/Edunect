import React, { useState, useEffect } from 'react'
import AdminNav from './components/AdminNav'
import axios from 'axios'
import PaginationPageBox from './components/PaginationPageBox'
import StudentComponent from './components/studentComponent'
import { useLogin } from "../required_context/LoginContext"
function Student() {
    const [studentArray, setStudentArray] = useState([])
    const [page, setPage] = useState(1);
    const [pageArray, setPageArray] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [searchMessage,setSeearchMessage] = useState("check");
    const PAGE_SIZE = 10
    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const get_max_page = (item_len, page_len) => {
        return Math.ceil(item_len / page_len);
    };

    const generateArray = (input) => {
        // Generate an array from 1 to the input number
        return Array.from({ length: input }, (_, index) => index + 1);
    };

    const handlePagination = (e) => {
        setPage(parseInt(e.target.value))
    }
    const handleSearch = (e) => {
        const value = e.target.value
        if (value === '') {
            setSearchResult([]);
            return;
        }
        // const filtered = studentArray.filter((item) =>
        //     item.full_name.toLowerCase().includes(value.toLowerCase())
        //   );
        const filtered = studentArray.filter((item) =>
            ['full_name', 'username', 'batch', 'branch', 'roll_no'].some(
                (key) =>
                    item[key] &&
                    item[key].toString().toLowerCase().includes(value.toLowerCase())
            )
        );  
        setPage(1)
        if(filtered.length === 0){
            setSeearchMessage('No Data Found')
        }else{
            setSeearchMessage(``)
        }
        setSearchResult(filtered)
    }
    useEffect(() => {
        axios.post(`http://127.0.0.1:8000/account/getStudents`)
            .then(response => {
                const arr = response.data.data
                setStudentArray(arr)
                const maxPages = get_max_page(arr.length, PAGE_SIZE);
                setPageArray(generateArray(maxPages));
            })
            .catch(error => {
                console.log(error)
            })
        console.log(studentArray)
    }, []);
    useEffect(() => {
        console.log('Updated productObject:', studentArray); // Log the updated state after it's changed
    }, [studentArray]);
    return (
        <div class='h-screen'>
            <AdminNav />
            {/* <div class='p-4'>
                <input type="text" name='search' onChange={(e)=>{setSearchText(e.target.value)}} />
            </div> */}
            <div class="flex justify-center items-center p-6 bg-gray-100">
                <div class="relative w-full max-w-xs">
                    <input type="text" class="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." name='search' onChange={handleSearch} />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="bi bi-search"></i>
                    </div>
                </div>
            </div>

            <div class='p-6'>
                {/* student data */}
                <p className='text-center'>{searchMessage}</p>

                {paginate((searchResult.length > 0 ? searchResult : studentArray), PAGE_SIZE, page).map((student, index) => {
                    return (
                        <StudentComponent id={index} full_name={student.full_name} username={student.username} branch={student.branch} batch={student.batch} roll_no={student.roll_no} />
                    )
                })}

            </div>
            <div className="p-4 flex items-center flex-wrap">
                <nav className='mx-auto'>
                    <ul className='inline-flex'>
                        {pageArray.map((item, index) => (
                            <li key={index}>
                                <PaginationPageBox pageNo={item} handler={handlePagination} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Student