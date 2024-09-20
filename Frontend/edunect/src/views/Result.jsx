import React, { useState, useEffect } from 'react';
import sampleExcel from '../assets/docs/Compile_Marksheet_Template.xlsx';
import { useLogin } from "../required_context/LoginContext";
import axios from 'axios';

function Result() {
  const { isLoggedIn, userType, username, firstTime } = useLogin();

  // States for student
  const [semArray, setSemArray] = useState([]);
  const [resultArray, setResultArray] = useState([]);

  // States for admin
  const [file, setFile] = useState();
  const [phase, setPhase] = useState();
  const [subject, setSubject] = useState();
  const [sem, setSem] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (userType === 'student') {
      axios({
        url: 'http://127.0.0.1:8000/scheduler/get_result_sem',
        method: 'post',
      })
      .then((res) => {
        setSemArray(res.data.unique_sems);
      });
    }
  }, [userType]);

  if (userType === 'student') {
    const semChanged = (selected_sem) => {
      let formData = new FormData();
      formData.append('student', username);
      formData.append('sem', selected_sem);
      axios({
        url: 'http://127.0.0.1:8000/scheduler/get_result',
        method: 'post',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setResultArray(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    };

    function printResult(divId) {
      var iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      var iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write('<html><head><title>Print</title>');
      iframeDoc.write('<script src="https://cdn.tailwindcss.com"></script>');
      iframeDoc.write('<style>body{font-family: Arial, sans-serif;}</style>');
      iframeDoc.write('</head><body>');
      iframeDoc.write(document.getElementById(divId).innerHTML);
      iframeDoc.write('</body></html>');
      iframeDoc.close();
      iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      };
    }

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6" id='result'>
          <h2 className="text-2xl font-bold mb-4">Check Your Results</h2>
          <label htmlFor="day-select" className="block text-lg font-medium text-gray-700">Select Semester</label>
          <select
            id="day-select"
            name="day"
            onChange={(e) => semChanged(e.target.value)}
            className="mt-2 mb-6 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          >
            <option value="" selected disabled hidden>Select Semester</option>
            {semArray.length > 0 ? semArray.map((sem, index) => (
              <option key={index} value={sem}>{sem}</option>
            )) : []}
          </select>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-blue-200">
              <tr>
                <th scope="col" className="px-6 py-3">Subject</th>
                <th scope="col" className="px-6 py-3">T1</th>
                <th scope="col" className="px-6 py-3">T2</th>
                <th scope="col" className="px-6 py-3">T3</th>
                <th scope="col" className="px-6 py-3">T4</th>
              </tr>
            </thead>
            <tbody>
              {resultArray.map((result) => (
                <tr key={result.subject} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{result.subject}</td>
                  <td className="px-6 py-4">{result.t1 || "-"}</td>
                  <td className="px-6 py-4">{result.t2 || "-"}</td>
                  <td className="px-6 py-4">{result.t3 || "-"}</td>
                  <td className="px-6 py-4">{result.t4 || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {resultArray.length > 0 && (
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center mb-4"
            onClick={() => printResult('result')}
          >
            Print Result
          </button>
        )}
      </div>
    );
  } else {
    async function handleFileChange(e) {
      setFile(e.target.files[0]);
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
      e.preventDefault();
      const formData = new FormData();
      formData.append('sem', sem);
      formData.append('phase', phase);
      formData.append('file', file);
      formData.append('subject', subject);
      axios({
        method: "post",
        url: "http://127.0.0.1:8000/scheduler/upload_result",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.resp === 1) {
          setSuccessMessage("Results created Successfully");
          setErrorMessage("");
        } else if (res.data.resp === 0) {
          setErrorMessage(res.data.error);
          setSuccessMessage("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Submit Results</h2>
          <form method="POST" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sem" className="block text-sm font-bold text-gray-700">Enter Semester</label>
              <input
                type="number"
                required
                name="sem"
                id="sem"
                placeholder="Enter Semester"
                onChange={(e) => setSem(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phase" className="block text-sm font-bold text-gray-700">Enter Phase (T1, T2, T3, T4)</label>
              <input
                type="text"
                name="phase"
                required
                id="phase"
                placeholder="Enter Phase"
                onChange={(e) => setPhase(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700">Enter Subject Name</label>
              <input
                type="text"
                required
                name="subject"
                id="subject"
                placeholder="Enter Subject"
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700">Upload File</label>
              <input
                type="file"
                required
                className="w-full text-gray-600 font-semibold text-sm bg-white border border-gray-300 rounded-lg file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-indigo-100 file:hover:bg-indigo-200 file:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={onButtonClick}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Template
              </button>
            </div>
            {successMessage && (
              <div className="mt-4 text-center text-green-600 font-semibold">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 text-center text-red-600 font-semibold">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default Result;
