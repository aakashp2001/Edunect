import React, { useState } from 'react'
import axios from 'axios'
import AdminNav from './components/AdminNav'
import { useLogin } from '../required_context/LoginContext'
import LoadingSpinner from './components/LoadingSpinner'

const Notifications = () => {
    const { userType } = useLogin()
    const [header, setHeader] = useState('');
    const [body, setBody] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
    const [message, setMessage] = useState("")


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({ header, body, date })

        try {

            let formData = {
                'notification_head': header,
                'notification_body': body,
                'date': date
            }


            axios.post('http://127.0.0.1:8000/account/addNotification', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response.data);
                    setMessage('Notification created successfully')
                })
                .catch(error => {
                    console.error(error);
                    alert('Failed to create notification');
                });
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <AdminNav />
            {
                userType === 'admin' && <div>
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
                                    onChange={(e) => {
                                        setDate((new Date(e.target.value)).toLocaleDateString('en-GB'));
                                    }}
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
                </div>
            }
            {
                userType !== 'admin' && <></>
            }

        </>
    )
}

export default Notifications