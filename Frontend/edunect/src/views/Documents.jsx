import React, { useState } from 'react'
import { useLogin } from '../required_context/LoginContext'
import pdfFile from './TOC_Practice Book_2024.pdf'
import AdminNav from './components/AdminNav'
function Documents() {
    const [fileState, setFileState] = useState()
    const [title, setTitle] = useState()
    const handleFileChange = (e) => {
        setFileState(e.target.files[0])
    }
    return (
        <div>
            <AdminNav />

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

            <div className="pdf-viewer">

                <div class="m-2 space-y-2">

                    <div
                        class="group flex flex-col gap-2 rounded-lg p-5 border border-black"
                        tabindex="2"
                    >
                        <div class="flex cursor-pointer items-center justify-between">
                            <span> Time Table </span>
                            <i
                                class="h-2 w-3 transition-all duration-500 group-focus:-rotate-180 bi bi-chevron-down" alt="Drop Down icon"
                            />
                        </div>
                        <div
                            class="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
                        >
                            <object style={{ width: "100%" }}
                                data={pdfFile}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                            >
                                <p>Your browser does not support PDFs. <a href={pdfFile}>Download the PDF</a>.</p>
                            </object>
                        </div>
                    </div>

                    <div
                        class="group flex flex-col gap-2 rounded-lg p-5 border border-black"
                        tabindex="2"
                    >
                        <div class="flex cursor-pointer items-center justify-between">
                            <span> Time Table </span>
                            <i
                                class="h-2 w-3 transition-all duration-500 group-focus:-rotate-180 bi bi-chevron-down" alt="Drop Down icon"
                            />
                        </div>
                        <div
                            class="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
                        >
                            <object style={{ width: "100%" }}
                                data={pdfFile}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                            >
                                <p>Your browser does not support PDFs. <a href={pdfFile}>Download the PDF</a>.</p>
                            </object>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Documents