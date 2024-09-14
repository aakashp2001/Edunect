import React from 'react'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import { useLogin } from '../../required_context/LoginContext.jsx'
import UserProfile from './UserProfile';
function AdminNav() {
    const { logout, userType, isLoggedIn } = useLogin()

    const toggleNav = () => {
        const menu = document.getElementById('navbar-default');
        menu.classList.toggle('hidden');
    }

    const performLogout = () => {
        logout()
    }
    const navItems = {
        student: [
            { label: 'Home', path: '/home' },
            { label: 'Notification', path: '/notifications' },
            { label: 'Timetable', path: '/timetable' },
            { label: 'Document', path: '/document' },
            { label: 'Result', path: '#' },
            { label: 'Attendence', path: '#' }
            
        ],
        admin: [
            { label: 'Home', path: '/home' },
            { label: 'Notification', path: '/notifications' },
            { label: 'SignUp', path: '/signup' },
            { label: 'Students', path: '/student' },
            { label: 'Timetable', path: '/timetable' },
            { label: 'Document', path: '/document' },
            { label: 'Result', path: '#' },
            { label: 'Attendence', path: '#' },

        ]
    };
    const currentNavItems = navItems[userType] || [];

    return (

        < div className='sticky left-0 top-0 z-50' >

            <nav className='bg-gray-100 shadow'>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to='/home' className='flex items-center space-x-3 rtl:space-x-reverse text-xl'>
                        <img src={logo} alt="Company Logo" className='h-10 mr-3' /> Edunect
                    </Link>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false" onClick={toggleNav}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full lg:block lg:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 lg:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 lg:flex-row lg:space-x-8 rtl:space-x-reverse lg:mt-0 lg:border-0  lg:w-100">
                            {currentNavItems.map((item,index) => (
                                <li key={index}><Link
                                    key={item.path}
                                    to={item.path}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                                >
                                    {item.label}
                                </Link></li>
                            ))}
                            {/* <li>
                                <Link to='/home' className="" aria-current='page'>Home</Link>
                            </li>
                            <li>
                                <Link to='#' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>Attendence</Link>
                            </li>
                            <li>
                                <Link to='/notifications' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>Notification</Link>
                            </li>
                            {(userType === 'admin') && <li>
                                <Link to='/signup' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>SignUp</Link>
                            </li>}
                            <li>
                                <Link to='#' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>Result</Link>
                            </li>
                            {(userType === 'admin') && <li>
                                <Link to='/students' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>Students</Link>
                            </li>}
                            <li>
                                <Link to="/timetable" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0">Timetable</Link>
                            </li>
                            <li>
                                <Link to='/document' className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0" aria-current='page'>Documents</Link>
                            </li>
                            */}
                            <li>
                                <Link to='#' className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 my-2" aria-current='page' onClick={performLogout}>{isLoggedIn &&  'Logout' || 'Login'}</Link>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {userType === 'student' && 
            <div>
                <UserProfile/>
            </div>}
        </div >
    )
}

export default AdminNav