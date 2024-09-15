import React, { useState } from 'react'
import Navigation from './components/Navigation'
import LoadingSpinner from './components/LoadingSpinner'
/**
 *
 * enrollment, email, full_name, branch, batch, roll_no
 */
function Register() {
  const [fileState, setFileState] = useState()
  const [defaultPassword, setDefaultPassword] = useState()
  const [loading, setLoading] = useState(false)
  const [sem, setSem] = useState(0)
  const [message, setMessage] = useState("")
  const signUp = (e) => {
    e.preventDefault();
    console.log('Performing login');
    const formData = new FormData();
    formData.append('file', fileState);
    formData.append('password', defaultPassword);
    formData.append('sem',sem);
    setLoading(true)

    fetch('http://127.0.0.1:8000/account/signup', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.message) {
          setMessage(data.message)
        } if (data.error) {
          setMessage(data.error)
        }
      })
      .catch(error => {
        setMessage(error.error)
        console.log(loading)

      })
      .finally(() => {
        setLoading(false)
      })
    console.log("sign up attempt complete");
  }
  const handleFileChange = (e) => {
    setFileState(e.target.files[0])
  }
  return (
    <div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign Up New Users
        </h2>

      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
          <form method="POST" className="space-y-6" onSubmit={signUp}>
            <div>
              <h1 className='text-xl my-4 border-b-2 font-semibold'>Instructions:</h1>
              <p className='py-4'>
                Excel should have following rows: <br /><em className='bg-slate-200'>enrollment, email, full_name, branch, batch, roll_no</em> <br />(case sensitive)
              </p>
            </div>
            <div>

              <div className="mt-1">
                {/* <input id="signup_file" name="signup_file" type="file" required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                <label className="text-base font-semibold mb-2 block">Upload file</label>
                <input type="file" onChange={handleFileChange}
                  className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" accept='.xlsx,.xls,.csv,.xml' />
                <p className="text-xs text-gray-400 mt-2">xlsx, csv are Allowed.</p>
                <label htmlFor="defaultPassword" className="block text-sm text-gray-700 mt-3 font-bold">
                  Default Password
                </label>
                <input type="text" name="defaultPassword" id="defaultPassword" onChange={(e) => { setDefaultPassword(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <label htmlFor="sem" className="block text-sm text-gray-700 mt-3 font-bold">
                  Semester
                </label>
                <input type="number" name="sem" id="sem" onChange={(e) => { setSem(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <button type="submit" className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                  Submit
                </button>
                <div id='response'>
                  {loading && <LoadingSpinner />}
                  {message}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Register