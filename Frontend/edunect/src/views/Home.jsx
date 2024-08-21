import React, { useEffect } from 'react'
import { useLogin } from "../required_context/LoginContext"
import AdminNav from './components/AdminNav';
function Home() {

  const { isLoggedIn, userType, username } = useLogin()
  useEffect(() => {
    if (!userType) {
      window.location.reload()
    }
  })
  console.log(userType)
  if (userType === 'undefined') {
    return (
      <div>
        <AdminNav />
        {/* <div className="container-fluid text-center mx-8 rounded-lg mt-5">

          <div class="grid grid-rows-3 grid-flow-col gap-4">
            <div class="row-span-3 bg-gray-400 rounded-xl">

              <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-amber-50'>Welcome, {username}!</h1>
              <p>This is the admin home page.</p>
            </div>
            <div class="col-span-2 ...">02</div>
            <div class="row-span-2 col-span-2 ...">03</div>
          </div>

        </div> */}
        <div className="p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white flex flex-col items-center justify-center text-center rounded-lg shadow-md">
              <h1 className='px-6 py-3 mt-6 text-4xl font-extrabold leading-none tracking-tight'>Welcome, {username}!</h1>
              <p className='px-6 mb-6'>This is the admin home page.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
                <p><strong>HOD Number:</strong> +1234567890</p>
                <p><strong>HOD Email:</strong> hod@example.com</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                <ul className="list-disc pl-5">
                  <li>Orientation Week - August 30, 2024</li>
                  <li>Midterm Exams - September 15-20, 2024</li>
                  <li>Career Fair - October 5, 2024</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
  else {
    return (<></>)
  }
}

export default Home