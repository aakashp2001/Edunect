import React, { useState, useEffect } from 'react';
import { useLogin } from '../required_context/LoginContext';
import LoadingSpinner from './components/LoadingSpinner';
import sampleExcel from '../assets/docs/Daily_Absent_Students_Template.xlsx';
import axios from 'axios';

const Attendance = () => {
  const { userType } = useLogin();
  const [fileState, setFileState] = useState();
  const [loading, setLoading] = useState(false);
  const [sem, setSem] = useState(0);
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState({});
  const [overall, setOverall] = useState([]);

  const getIndexSums = (data) => {
    const subjects = Object.values(data.attendance);
    const maxLength = Math.max(...subjects.map(arr => arr.length));
    const indexSums = Array(maxLength).fill(0);
    subjects.forEach(subject => {
      subject.forEach((value, index) => {
        indexSums[index] += value;
      });
    });
    return indexSums;
  };

  const onButtonClick = () => {
    const link = document.createElement('a');
    link.href = sampleExcel;
    link.download = 'Daily_Absent_Students_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (userType === 'student') {
      const profileData = localStorage.getItem('profileData');
      if (profileData) {
        try {
          const parsedData = JSON.parse(profileData);
          const { sem, batch, roll_no: student } = parsedData;

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
              console.log(resp.data);
              if (resp.data.attendance) {
                setAttendance(resp.data.attendance);
                if (attendance) {
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
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Attendance Details</h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
          <table className="min-w-full text-sm text-left text-gray-500 border">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">Subject</th>
                <th scope="col" className="px-6 py-3">Attended</th>
                <th scope="col" className="px-6 py-3">Conducted</th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance !== "No record" ? Object.entries(attendance).map(([key, value]) => [key, ...value]).map((subject) => (
                <tr key={subject[0]} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{subject[0]}</th>
                  <td className="px-6 py-4">{subject[2]}</td>
                  <td className="px-6 py-4">{subject[1]}</td>
                  <td className="px-6 py-4">{((subject[2] / subject[1]) * 100).toFixed(2)}%</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-red-600">Attendance Data Not Found</td>
                </tr>
              )}
              {attendance !== "No record" && overall.length > 0 && (
                <tr className="bg-gray-100">
                  <th scope="row" className="px-6 py-4 font-semibold text-gray-900">Overall</th>
                  <td className="px-6 py-4">{overall[1]}</td>
                  <td className="px-6 py-4">{overall[0]}</td>
                  <td className="px-6 py-4">{((overall[1] / overall[0]) * 100).toFixed(2)}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    const handleFileChange = (e) => {
      setFileState(e.target.files[0]);
    }

    const setAttendence = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', fileState);
      formData.append('sem', sem);
      setLoading(true);
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/scheduler/upload_attendance',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((resp) => {
          console.log(resp.data);
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
          console.error(error);
          setMessage(error.response?.data?.error || "An unknown error occurred");
          setLoading(false);
        });
    }

    return (
      <div className="max-w-lg mx-auto p-4 mt-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Submit Attendance</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form method="POST" className="space-y-6" onSubmit={setAttendence}>
            <div>
              <label className="text-base font-semibold mb-2 block">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-gray-600 font-semibold text-sm bg-white border border-gray-300 rounded-lg file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-indigo-100 file:hover:bg-indigo-200 file:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                accept='.xlsx,.xls,.csv,.xml'
              />
              <p className="text-xs text-gray-500 mt-2">Allowed formats: xlsx, csv</p>
            </div>
            <div>
              <label htmlFor="sem" className="block text-sm font-semibold text-gray-700">Semester</label>
              <input
                type="number"
                name="sem"
                id="sem"
                onChange={(e) => { setSem(e.target.value); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
            <div id="response" className="text-center mt-4">
              {loading && <LoadingSpinner />}
              {message && <p className="text-gray-600">{message}</p>}
            </div>
          </form>
          <h3 className="text-base font-semibold mb-2 mt-4">Download Sample File</h3>
          <button
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={onButtonClick}
          >
            Download Sample Template
          </button>
        </div>
      </div>
    );
  }
}

export default Attendance;
