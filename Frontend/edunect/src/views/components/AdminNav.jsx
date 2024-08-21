import React from 'react'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import {useLogin} from '../../required_context/LoginContext.jsx'
function AdminNav() {
    const { logout } =  useLogin()

    const toggleNav = () => {
        const menu = document.getElementById('navbar-default');
        menu.classList.toggle('hidden');
    }

    const performLogout = () => {
        logout()
    }   

    return (
        <div className='sticky top-0 z-50'>

            <nav className='bg-gray-100 shadow'>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to='/home' className='flex items-center space-x-3 rtl:space-x-reverse text-xl'>
                        <img src={logo} alt="Company Logo" className='h-10 mr-3' /> Edunect
                    </Link>
                    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false" onClick={toggleNav}>
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div class="hidden w-full lg:block lg:w-auto" id="navbar-default">
                        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  md:w-100">
                            <li>
                                <Link to='/home' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Home</Link>
                            </li>
                            <li>
                                <Link to='#' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Attendence</Link>
                            </li>
                            <li>
                                <Link to='/' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Notification</Link>
                            </li>
                            <li>
                                <Link to='/signup' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>SignUp</Link>
                            </li>
                            <li>
                                <Link to='#' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Result</Link>
                            </li>
                            <li>
                                <Link to='#' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Students</Link>
                            </li>
                            <li>
                                <Link to='#' class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current='page'>Documents</Link>
                            </li>
                            <li>
                                <Link to='#' class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" aria-current='page' onClick={performLogout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default AdminNav