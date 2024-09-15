import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation'
import { useLogin } from '../required_context/LoginContext';
import NotificationItem from './components/Notification_Item';
import LoadingSpinner from './components/LoadingSpinner';
import PaginationPageBox from './components/PaginationPageBox';

const Notifications = () => {
    const { userType } = useLogin();
    const [header, setHeader] = useState('');
    const [body, setBody] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [notificationArr, setNotificationArr] = useState([]);
    const [pageArray, setPageArray] = useState([]);
    const [loader, setLoader] = useState(false);
    const PAGE_SIZE = 10;

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

    useEffect(() => {
        if (!userType) {
            console.error('User type is not defined');
            return;
        }

        setLoader(true);
        axios.get('http://127.0.0.1:8000/account/getNotification')
            .then((response) => {
                const arr = response.data.data;

                setNotificationArr(arr);
                const maxPages = get_max_page(arr.length, PAGE_SIZE);
                setPageArray(generateArray(maxPages));
                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                setLoader(false);
            });
    }, [userType]);


    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = {
            'notification_head': header,
            'notification_body': body,
            'date': new Date(date).toLocaleDateString('en-GB')
        };

        axios.post('http://127.0.0.1:8000/account/addNotification', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Notification created successfully');
                setHeader('')
                setBody('')
                setDate(new Date().toISOString().split('T')[0]);
            })
            .catch(error => {
                console.error(error);
                alert('Failed to create notification');
            });
    };

    if (userType !== 'admin') {
        return (
            <div className=''>
                {loader && <LoadingSpinner />}
                {notificationArr.length > 0 ? (
                    <>
                        <div className="max-w-full mx-auto mt-8 space-y-4">
                            {paginate(notificationArr, PAGE_SIZE, page).map((notification, index) => (
                                <div key={index} className="bg-white shadow-lg rounded-lg mx-4 p-6 hover:shadow-xl transition-shadow duration-300">
                                    <h3 className="text-xl font-semibold text-indigo-600 mb-2">{notification.notification_head}</h3>
                                    <p className="text-gray-700 mb-4">{notification.notification_body}</p>
                                    <div className="text-right text-sm text-gray-500">{new Date(notification.date).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 flex items-center flex-wrap z-10">
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
                    </>
                ) : (
                    <p>No notifications available.</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="max-w-md mx-auto p-6 mt-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Create Notification</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="notification_head" className="block text-sm font-medium text-gray-700 mb-1">Header</label>
                        <input
                            type="text"
                            id="notification_head"
                            value={header}
                            name='notification_head'
                            onChange={(e) => setHeader(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="notification_body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            id="notification_body"
                            value={body}
                            name='notification_body'
                            onChange={(e) => setBody(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(new Date(e.target.value).toISOString().split('T')[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Notification
                    </button>
                    <div id='response' className='bg-green-200 text-center text-green-700 rounded-md'>
                        {message}
                    </div>
                </form>
            </div>
            {/* {paginate(notificationArr, PAGE_SIZE, page).map((notification, index) => (
                <NotificationItem
                    key={index}
                    notification_head={notification.notification_head}
                    notification_body={notification.notification_body}
                    date={notification.date}
                />
            ))} */}
            <div className="max-w-full mx-auto mt-8 space-y-4">
                {paginate(notificationArr, PAGE_SIZE, page).map((notification, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg mx-4 p-6 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">{notification.notification_head}</h3>
                        <p className="text-gray-700 mb-4">{notification.notification_body}</p>
                        <div className="text-right text-sm text-gray-500">{new Date(notification.date).toLocaleDateString()}</div>
                    </div>
                ))}
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

        </>
    );
};

export default Notifications;
