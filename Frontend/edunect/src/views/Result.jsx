import React, { useState, useEffect } from 'react'
import sampleExcel from '../assets/docs/Compile_Marksheet_Template.xlsx'
import { useLogin } from "../required_context/LoginContext"
import axios from 'axios'


function Result() {
  const { isLoggedIn, userType, username, firstTime } = useLogin()
  // states for student
  const [semArray, setSemArray] = useState([])
  const [resultArray, setResultArray] = useState([])
  // states for admin
  const [file, setFile] = useState()
  const [phase, setPhase] = useState()
  const [subject, setSubject] = useState()
  const [sem, setSem] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  // common for both

  useEffect(() => {
    if (userType === 'student') {
      axios({
        url: 'http://127.0.0.1:8000/scheduler/get_result_sem', method: 'post',

      })
        .then((res) => {
          setSemArray(res.data.unique_sems)
          console.log(semArray)
        })
    }
  }, [])

  if (userType === 'student') {

    const semChanged = (selected_sem) => {
      if (userType === 'student') {
        let formData = new FormData()
        formData.append('student', username)
        formData.append('sem', selected_sem)
        axios({
          url: 'http://127.0.0.1:8000/scheduler/get_result', method: 'post',
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            // setSemArray(res.data)
            console.log(res.data)
            setResultArray(res.data.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    function printResult(divId) {
      // Create an iframe element
      var iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    
      // Get the iframe's document
      var iframeDoc = iframe.contentWindow.document;
    
      // Write the content into the iframe's document
      iframeDoc.open();
      iframeDoc.write('<html><head><title>Print</title>');
      
      // Include Tailwind CSS CDN script
      iframeDoc.write('<script src="https://cdn.tailwindcss.com"></script>');
      
      // Include additional styles if necessary
      iframeDoc.write('<style>body{font-family: Arial, sans-serif;}</style>');
      
      iframeDoc.write('</head><body>');
      iframeDoc.write(document.getElementById(divId).innerHTML);
      iframeDoc.write('</body></html>');
      iframeDoc.close();
    
      // Wait for Tailwind CSS to load before calling print
      iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    
        // Remove the iframe from the body after printing
        document.body.removeChild(iframe);
      };
    }
    
    
    

    return (
      <div>
        <div className="my-4" id='result'>
          
          <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">Select Sem</label>
          <select
            id="day-select"
            name="day"
            onChange={(e) => { semChanged(e.target.value) }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" selected disabled hidden>Select Sem</option>
            {(semArray.length > 0) ? semArray.map((sem, index) => (
              <option key={index} value={sem}>{sem}</option>
            )) : []}
          </select>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">Subject</th>
                <th scope="col" className="px-6 py-3">T1</th>
                <th scope="col" className="px-6 py-3">T2</th>
                <th scope="col" className="px-6 py-3">T3</th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">T4</th>
              </tr>
            </thead>
            <tbody>
              {resultArray.map((result) => (
                <tr key={result.subject} className="bg-white">
                  <td className="px-6 py-4">{result.subject}</td>
                  <td className="px-6 py-4">{result.t1 || "-"}</td>
                  <td className="px-6 py-4">{result.t2 || "-"}</td>
                  <td className="px-6 py-4">{result.t3 || "-"}</td>
                  <td className="px-6 py-4">{result.t4 || "-"}</td>
                </tr>
              ))}
              
              {/* {Array.from({ length }).map((_, i) => (
                                    <tr key={i} className="bg-white">
                                    {
                                        day[i] === selectedDay && (
                                            <>
                                            <td className="px-6 py-4">{day[i]}</td>
                                            <td className="px-6 py-4">{className[i]}</td>
                                            <td className="px-6 py-4">{batch[i]}</td>
                                            </>
                                            )
                                            }
                                            </tr>
                                            ))} */}

            </tbody>
          </table>
        </div>
        {resultArray.length > 0 ? (
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => { printResult('result') }}>Print</button>
              ) : []}
      </div>
    )
  }
  else {

    async function handleFileChange(e) {
      await setFile(e.target.files[0])
    }
    const onButtonClick = () => {
      const link = document.createElement('a');
      link.href = sampleExcel;
      link.download = 'Compile_Marksheet_Template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const handleSubmit = (e) => {
      e.preventDefault()
      const formData = new FormData();
      formData.append('sem', sem);
      formData.append('phase', phase)
      formData.append('file', file)
      formData.append('subject', subject)
      axios({
        method: "post",
        url: "http://127.0.0.1:8000/scheduler/upload_result",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          console.log(res);
          if (res.data.resp === 1) {
            setSuccessMessage("Results created Successfully")
          } else if (res.data.resp === 0) {
            setErrorMessage(res.data.error)
          }

        })
        .catch((err) => {
          console.log(err)
        })
    }
    return (
      <div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Submit Result
            </h2>
          <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
            <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="sem" className="block text-sm text-gray-700 mt-3 font-bold">
                  Enter Sem
                </label>
                <input type="number" required name="sem" id="sem" placeholder='Enter Sem' onChange={(e) => { setSem(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <label htmlFor="phase" className="block text-sm text-gray-700 mt-3 font-bold">
                  Enter Phase (t1,t2,t3,t4)
                </label>
                <input type="text" name="phase" required id="phase" placeholder="Enter Phase" onChange={(e) => { setPhase(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                <label htmlFor="subject" className="block text-sm text-gray-700 mt-3 font-bold">
                  Enter Subject Name
                </label>
                <input type="text" required name="subject" id="subject" placeholder="Enter Subject" onChange={(e) => { setSubject(e.target.value) }} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />

                <div className="mt-1">
                  {/* <input id="signup_file" name="signup_file" type="file" required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                  <label className="text-base font-semibold mb-2 block">Upload file</label>
                  <input type="file" required onChange={handleFileChange}
                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" accept='.xlsx' />
                  <p className="text-xs text-gray-400 mt-2">excel only Allowed.</p>

                </div>
                <div>
                  <button type="submit" className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                    Submit
                  </button>
                  <p className='text-red-700 bg-red-200'>{errorMessage}</p>
                  <p className='text-green-800 rounded-md px-1 text-center bg-green-200'>{successMessage}</p>
                </div>
              </div>
            </form>
            <h3 className="text-base font-semibold mb-2 block">Click on the button below to download the sample file</h3>
            <button className="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onButtonClick}>
              Download Sample Marksheet Template
            </button>
          </div>
        </div>
        <div className="container text-center mt-5">

        </div>
      </div>
    )

  }
}

export default Result