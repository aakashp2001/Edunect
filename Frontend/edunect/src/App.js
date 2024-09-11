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
function App() {
  return (
    <div>
    
        <LoginProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/attendance" element={<Attendance/>}/>
              <Route path='/temp' element={<PdfViewer />}/>
              {/* Private routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/document" element={<Documents/>}/>
                <Route path='/students' element={<Student/>}/>
                <Route path='/notifications' element={<Notifications/>}/>
                <Route path='/timetable' element={<TimeTable/>}/> 
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
