import './App.css';
import Login from "./views/login.jsx"
import Register from "./views/register.jsx"
import Home from './views/Home.jsx'
import NotFound from './views/NotFound.jsx';
import { LoginProvider } from './required_context/LoginContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './views/components/PrivateRoute.jsx';
import Documents from './views/Documents.jsx';
import Student from './views/Student.jsx';
import Footer from './views/components/Footer.jsx';
import PdfViewer from './views/Temp.jsx';
import Notifications from './views/Notifications.jsx';
import Attendance from './views/Attendance.jsx';
import TimeTable from './views/TimeTable.jsx';
import Navigation from './views/components/Navigation.jsx';
import UserProfile from './views/components/UserProfile.jsx';
import Result from './views/Result.jsx'
import AdminAttendance from './views/AdminAttendance.jsx';
import AdminResult from "./views/AdminResult.jsx"
function App() {
  /***
   * ### Project Title: Edunect
### Enrollment Numbers
```
Aakash Prajapati    : 23002170120001
Om Maniar           : 23002171220008
Himanshu Nirmal     : 23002171220011
```
### Date
``` 
21-09-24
```

### subject name
```
FSD-2 and FCSP-2
```

   */
  return (
    <div>

      <LoginProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/temp' element={<PdfViewer />} />
            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path='/result' element={<Result />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/document" element={<Documents />} />
              <Route path='/students' element={<Student />} />
              <Route path='/notifications' element={<Notifications />} />
              <Route path="/admin/get-attendance" element={<AdminAttendance/>}/>
              <Route path='/timetable' element={<TimeTable />} />
              <Route path='/admin/get-result' element={<AdminResult/>}/>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        {/* <Footer /> */}
      </LoginProvider>
    </div>

  );
}

export default App;
