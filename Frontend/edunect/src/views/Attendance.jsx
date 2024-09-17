import React, { useState, useEffect } from 'react'
import { useLogin } from '../required_context/LoginContext'
import LoadingSpinner from './components/LoadingSpinner'
import axios from 'axios'
const Attendance = () => {
  const { userType } = useLogin();
  const [fileState, setFileState] = useState()
  const [loading, setLoading] = useState(false)
  const [sem, setSem] = useState(0)
  const [message, setMessage] = useState("")
  const [attendance, setAttendance] = useState({})
  const [overall, setOverall] = useState([])
  const getIndexSums = (data) => {
    // Extract the arrays from the data object
    const subjects = Object.values(data.attendance);
    
    // Determine the maximum length of the arrays
    const maxLength = Math.max(...subjects.map(arr => arr.length));
  
    // Initialize an array to hold the sums of each index
    const indexSums = Array(maxLength).fill(0);
  
    // Iterate over each subject's array
    subjects.forEach(subject => {
      subject.forEach((value, index) => {
        indexSums[index] += value;
      });
    });
  
    return indexSums;
  };
  useEffect(() => {
    if (userType === 'student') {
      const profileData = localStorage.getItem('profileData'); // Corrected spelling
      if (profileData) {
        try {
          const parsedData = JSON.parse(profileData);
          const { sem, batch, roll_no: student } = parsedData; // Destructure data

          const formData = new FormData();
          formData.append('batch', batch);
          formData.append('sem', sem);
          formData.append('student', student);

          setLoading(true);

          axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/scheduler/get_attendance',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          })
            .then((resp) => {
              // Axios automatically parses the response data
              console.log(resp.data);
              // Check the response data directly
              if (resp.data.attendance) {
                setAttendance(resp.data.attendance);
                if( attendance){
                  setOverall(getIndexSums(resp.data));

                }

              } else if (resp.data.error) {
                setMessage(resp.data.error);
              } else {
                console.log(resp.data);
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setMessage(error.response?.data?.error || 'An unknown error occurred');
              setLoading(false);
            });
        } catch (error) {
          console.error('Error parsing profile data:', error);
          setMessage('Error parsing profile data');
          setLoading(false);
        }
      } else {
        setMessage('No profile data found');
        setLoading(false);
      }
    }
  }, [userType]);

  if (userType === "student") {
    return (
      <div>
        {/* 
            per subject: total attended, total conducted, subject attendence percentage
            over attended, overall conducted, total percentage
          */}
        <div className="p-2">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">Subject</th>
                <th scope="col" className="px-6 py-3">Attended</th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">Conducted</th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">Percentage</th>

              </tr>
            </thead>
            <tbody>
              {attendance != "No record" ? Object.entries(attendance).map(([key, value]) => [key, ...value]).map((subject) => (
                <tr key={subject[0]} className="bg-white">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 break-words">
                    {subject[0]}
                  </th>
                  <td className="px-6 py-4">{subject[1]}</td>
                  <td className="px-6 py-4">{subject[2]}</td>
                  <td className="px-6 py-4">{(subject[1] / subject[2]) * 100}%</td>
                </tr>
              )) : []}
              {attendance != "No record" && (
                <tr>
                  {(overall.length > 0) && (
                      <>
                        <th>Overall</th>

                        <td className="px-6 py-4">{overall[0]}</td>

                        <td className="px-6 py-4">{overall[1]}</td>
                        <td className="px-6 py-4">{overall[0]/overall[1]*100}</td>
                      </>


                    )
                  }
                </tr>
              )}

            </tbody>
          </table>
          {attendance == "No record" ? (<p className='text-center p-2 rounded-md bg-red-200 text-red-700'>Attendence Data Not found</p>) : []}
        </div>
      </div>
    )
  } else {
    const handleFileChange = (e) => {
      setFileState(e.target.files[0])
    }

    const setAttendence = (e) => {
      e.preventDefault();
      // console.log('Performing login');
      const formData = new FormData();
      formData.append('file', fileState);
      formData.append('sem', sem);
      setLoading(true)
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/scheduler/upload_attendance',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((resp) => {
          // Axios automatically parses the response data
          console.log(resp.data);
          // Check the response data directly
          if (resp.data.message) {
            setMessage(resp.data.message);
          } else if (resp.data.error) {
            setMessage(resp.data.error);
          } else {
            setMessage("Successfully added attendance");
          }
          setLoading(false);
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
          setMessage(error.response?.data?.error || "An unknown error occurred");
          setLoading(false);
        });

      // console.log("sign up attempt complete");
    }
    return (
      <div>
        <div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Submit Attendence
            </h2>

          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
              <form method="POST" className="space-y-6" onSubmit={setAttendence}>
                <div>
                  <h1 className='text-xl my-4 border-b-2 font-semibold'>Instructions:</h1>
                  <p className='py-4'>
                    Excel should have following rows: <br /><em className='bg-slate-200'></em> <br />(case sensitive)
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
      </div>
    )
  }
}

export default Attendance