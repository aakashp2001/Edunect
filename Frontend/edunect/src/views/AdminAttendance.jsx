import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from '../required_context/LoginContext';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
function AdminAttendance(props) {
  const [attendance, setAttendance] = useState({});
  const [overall, setOverall] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const { userType } = useLogin()
  const navigate = useNavigate()
  if (userType === "student") {
    navigate('/not-found')
  }
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

  useEffect(() => {
    const fetchAttendance = async () => {

      // Extract specific query parameters
      const batch = searchParams.get('batch');
      const sem = searchParams.get('sem');
      const username = searchParams.get('student');
      console.log(batch,sem,username)
      const formData = new FormData();
      formData.append('batch', batch);
      formData.append('sem', sem);
      formData.append('student', username);

      setLoading(true);
      setMessage('');

      try {
        const resp = await axios.post('http://127.0.0.1:8000/scheduler/get_attendance', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (resp.data.attendance) {
          console.log(resp.data)
          setAttendance(resp.data.attendance);
          setOverall(getIndexSums(resp.data));
          console.log(attendance)
        } else if (resp.data.error) {
          setMessage(resp.data.error);
        }
      } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.error || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Attendance Details</h1>
      {message && <p className="text-red-600 text-center">{message}</p>}
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
            {Object.entries(attendance).length > 0 ? Object.entries(attendance).map(([key, value]) => (
              <tr key={key} className="bg-white border-b hover:bg-gray-50">
                {console.log(value)}
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{key}</th>
                <td className="px-6 py-4">{value[1]}</td>
                <td className="px-6 py-4">{value[0]}</td>
                <td className="px-6 py-4">{((value[1] / value[0]) * 100).toFixed(2)}%</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-red-600">Attendance Data Not Found</td>
              </tr>
            )}
            {overall.length > 0 && (
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
}

export default AdminAttendance;
