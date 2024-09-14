import React, { useEffect, useState } from 'react'
import { useLogin } from "../required_context/LoginContext"
import Navigation from './components/Navigation'
import axios from 'axios';
import ChangePassword from './ChangePassword';
import UserProfile from './components/UserProfile';
function Home() {

  const { isLoggedIn, userType, username, firstTime } = useLogin()
  const [notificationArr, setNotificationArr] = useState([])
  var arry = [];

  // setNotificationArr(arr)
  useEffect(() => {
    if (!userType) {
      window.location.reload()
    }
    axios.get('http://127.0.0.1:8000/account/getNotification')
      .then((response) => {
        const arr = (response.data.data);

        // console.log(arr);

        // arry = arr
        // console.log(arry);
        // for (let i in arr){
        //   console.log(arr[i]);
        // }
        setNotificationArr(arr);

      }).catch((err) => { console.error(err) });

  }, [])
  const contacts = [{
    "Activity": "Internal Quality Assurance Cell",
    "Coordinator": "Mr. Rohit Patel",
    "Contact": 9825836462
  },
  {
    "Activity": "Grievance Redressal Cell",
    "Coordinator": "Prof. Mitesh Thakkar",
    "Contact": 9825958958
  },
  {
    "Activity": "Internal Complaint Committee for Sexual harassment & Women Development Cell",
    "Coordinator": "Prof. Kruti Patel",
    "Contact": 9016632984
  },
  {
    "Activity": "Staff Welfare Committee",
    "Coordinator": "Prof. Ami Patel",
    "Contact": 9408754787
  },
  {
    "Activity": "GTU Committee\/ Exam Section",
    "Coordinator": "Prof. Hiren Makwana",
    "Contact": 9824258421
  },
  {
    "Activity": "Alumni Cell",
    "Coordinator": "Prof. Parth Sinroza",
    "Contact": 9601408487
  },
  {
    "Activity": "Anti-Ragging Committee",
    "Coordinator": "Prof. Tushar Thakar",
    "Contact": 9726711507
  },
  {
    "Activity": "SC-ST Cell",
    "Coordinator": "Prof. Zalak Bhavsar",
    "Contact": 9427416296
  },
  {
    "Activity": "Extra-Curricular Committee",
    "Coordinator": "Prof. Nimish Das",
    "Contact": 8866736326
  },
  {
    "Activity": "Training and Placement Cell",
    "Coordinator": "Prof. Mosam Pandya",
    "Contact": 9662304452
  },
  {
    "Activity": "Men Harassment Prevention and Redressal Cell",
    "Coordinator": "Prof. Mosam Pandya",
    "Contact": 9662304452

  }]
  const notifications = [
    { title: "System Maintenance", message: "Scheduled system maintenance on August 25, 2024.", date: "August 21, 2024" },
    { title: "New Policy Update", message: "New student policy updates have been published.", date: "August 20, 2024" },
    { title: "Campus Event", message: "Join us for the campus clean-up day this Friday.", date: "August 19, 2024" },
  ];
  if (userType === 'admin') {
    return (
      <div>
        <div className="p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className='flex flex-col space-y-6 flex-1'>
              <div className="flex-1 bg-white flex flex-col items-center justify-center text-center rounded-lg shadow-md">
                <h1 className='px-6 py-3 mt-6 text-4xl font-extrabold leading-none tracking-tight'>
                  Welcome, {username}!
                </h1>
                <p className='px-6 mb-6'>This is the admin home page.</p>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                <ul className="space-y-4">
                  {notificationArr.slice(0, 3).map((notification) => (
                    <li className="border-b border-gray-200 pb-4">
                      <p className="text-gray-800 font-semibold">{notification.notification_head}</p>
                      <p className="text-gray-600">{notification.notification_body.split('\n').map(body => { return (<div>{body}<br /></div>) })}</p>
                      <p className="text-gray-400 text-sm">{notification.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col space-y-6 flex-1">
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 rounded-s-lg">Activity</th>
                        <th scope="col" className="px-6 py-3">Coordinator</th>
                        <th scope="col" className="px-6 py-3 rounded-e-lg">Contact No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.Activity} className="bg-white">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 break-words">
                            {contact.Activity}
                          </th>
                          <td className="px-6 py-4">{contact.Coordinator}</td>
                          <td className="px-6 py-4">{contact.Contact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )

  }
  else {
    return (
      <>
        {firstTime === true ?
          <ChangePassword /> :
          (
            <div>
              <div className="p-6 bg-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className='flex flex-col space-y-6 flex-1'>
                    <div className="flex-1 bg-white flex flex-col items-center justify-center text-center rounded-lg shadow-md">
                      <h1 className='px-6 py-3 mt-6 text-4xl font-extrabold leading-none tracking-tight'>
                        Welcome, {username}!
                      </h1>
                      <p className='px-6 mb-6'>This is the home page.</p>
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                      <ul className="space-y-4">
                        {notificationArr.slice(0, 3).map((notification) => (
                          <li className="border-b border-gray-200 pb-4">
                            <p className="text-gray-800 font-semibold">{notification.notification_head}</p>
                            <p className="text-gray-600">{notification.notification_body.split('\n').map(body => { return (<div>{body}<br /></div>) })}</p>
                            <p className="text-gray-400 text-sm">{notification.date}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-6 flex-1">
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                            <tr>
                              <th scope="col" className="px-6 py-3 rounded-s-lg">Activity</th>
                              <th scope="col" className="px-6 py-3">Coordinator</th>
                              <th scope="col" className="px-6 py-3 rounded-e-lg">Contact No.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map((contact) => (
                              <tr key={contact.Activity} className="bg-white">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 break-words">
                                  {contact.Activity}
                                </th>
                                <td className="px-6 py-4">{contact.Coordinator}</td>
                                <td className="px-6 py-4">{contact.Contact}</td>
                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </>
    )
  }
}

export default Home