import React, { useState, useEffect } from 'react'
import { useLogin } from "../required_context/LoginContext";
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function AdminResult() {
  const { isLoggedIn, userType, firstTime } = useLogin();
  const [semArray, setSemArray] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
      axios({
        url: 'http://127.0.0.1:8000/scheduler/get_result_sem',
        method: 'post',
      })
        .then((res) => {
          console.log(res)
          setSemArray(res.data.unique_sems);
        });
    console.log(semArray)
  }, []);


    const semChanged = (selected_sem) => {
      let formData = new FormData();
      const username = searchParams.get('username');
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
  
}
export default AdminResult