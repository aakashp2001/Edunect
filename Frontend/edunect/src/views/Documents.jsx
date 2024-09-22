import React, { useState, useEffect } from 'react'
import { useLogin } from '../required_context/LoginContext'
import pdfFile from './TOC_Practice Book_2024.pdf'
import Navigation from './components/Navigation'
import Link from 'react-router-dom'
import PaginationPageBox from './components/PaginationPageBox'
import axios from 'axios'
function Documents() {
    const { userType } = useLogin()
    const [fileState, setFileState] = useState()
    const [title, setTitle] = useState('')
    const [pdfFiles, setPdfFiles] = useState([])
    const [openIndex, setOpenIndex] = useState(-1);
    const [pageArray, setPageArray] = useState([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5
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
    // loading data with axios
    useEffect(() => {
        axios(
            {
                url: `http://127.0.0.1:8000/scheduler/get_all_documents`,
                method: 'POST',
            })
            .then(
                (res) => {
                    console.log(res.data)
                    let arr = res.data.documents
                    setPdfFiles(res.data.documents)
                    const maxPages = get_max_page(arr.length, PAGE_SIZE);
                    setPageArray(generateArray(maxPages));
                    console.log(pageArray, page)
                }
            )
    }, [])

    const toggleAccordion = (index) => {
        // If the clicked accordion is already open, close it; otherwise, open it
        setOpenIndex(openIndex === index ? -1 : index);
    };
    const handleFileChange = (e) => {
        setFileState(e.target.files[0])
    }

    const uploadDocument = (e) => {
        e.preventDefault()

        let formData = new FormData()
        console.log(title, fileState)
        formData.append('title', title)
        formData.append('document', fileState)
        axios(
            {
                url: `http://127.0.0.1:8000/scheduler/upload_document`,
                method: 'POST',
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(
                (res) => {
                    console.log(res.data)
                    if (res.data.resp === 1) {
                        axios(
                            {
                                url: `http://127.0.0.1:8000/scheduler/get_all_documents`,
                                method: 'POST',
                            })
                            .then(
                                (res) => {
                                    console.log(res.data)
                                    let arr = res.data.documents
                                    setPdfFiles(res.data.documents)
                                    const maxPages = get_max_page(arr.length, PAGE_SIZE);
                                    setPageArray(generateArray(maxPages));
                                }
                            )
                    }
                }
            )
            .catch((err) => { console.log(err) })
    }

    if (userType === "student") {
        return (
            <div className='container'>
                <div className="pdf-viewer">
                    <div className="m-2 space-y-2">
                        {paginate(pdfFiles, PAGE_SIZE, page).map((pdfFile, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 rounded-lg p-5 border border-black"
                                onClick={() => toggleAccordion(index)}
                                tabIndex="2"
                            >
                                <div className="flex cursor-pointer items-center justify-between">
                                    <span> {pdfFile.title} </span>
                                    <i
                                        className={`h-2 w-3 transition-all duration-500 ${openIndex === index ? '-rotate-180' : 'rotate-0'
                                            } bi bi-chevron-down`}
                                        alt="Drop Down icon"
                                    />
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <iframe
                                        style={{ width: '100%', height: '600px', border: 'none' }}
                                        src={'http://127.0.0.1:8000' + pdfFile.document}
                                        title="PDF Viewer"
                                    >
                                        <p>Your browser does not support iframes. <a href={'http://127.0.0.1:8000' + pdfFile.document}>Download the PDF</a>.</p>
                                    </iframe>
                                </div>
                            </div>
                        ))}
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
            </div>
        )
    } else {
        return (
            <div>

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Add Documents
                    </h2>

                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
                        <form method="POST" className="space-y-6" onSubmit={uploadDocument}>
                            <div>
                                <label htmlFor="defaultPassword" className="block text-sm text-gray-700 mt-3 font-bold">
                                    Enter Document Title
                                </label>
                                <input required type="text" name="defaultPassword" id="defaultPassword" onChange={(e) => { setTitle(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <div className="mt-1">
                                    {/* <input id="signup_file" name="signup_file" type="file" required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                                    <label className="text-base font-semibold mb-2 block">Upload file</label>
                                    <input required type="file" onChange={handleFileChange}
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
                <div className="pdf-viewer">
                    <div className="m-2 space-y-2">
                        {paginate(pdfFiles, PAGE_SIZE, page).map((pdfFile, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 rounded-lg p-5 border border-black"
                                onClick={() => toggleAccordion(index)}
                                tabIndex="2"
                            >
                                <div className="flex cursor-pointer items-center justify-between">
                                    <span> {pdfFile.title} </span>
                                    <i
                                        className={`h-2 w-3 transition-all duration-500 ${openIndex === index ? '-rotate-180' : 'rotate-0'
                                            } bi bi-chevron-down`}
                                        alt="Drop Down icon"
                                    />
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <iframe
                                        style={{ width: '100%', height: '600px', border: 'none' }}
                                        src={'http://127.0.0.1:8000' + pdfFile.document}
                                        title="PDF Viewer"
                                    >
                                        <p>Your browser does not support iframes. <a href={'http://127.0.0.1:8000' + pdfFile.document}>Download the PDF</a>.</p>
                                    </iframe>
                                </div>
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
        )
    }

}

export default Documents