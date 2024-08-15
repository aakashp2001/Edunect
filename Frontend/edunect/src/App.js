import './App.css';
import Login from "./views/login.jsx"
import Register from "./views/register.jsx"
import Home from './views/Home.jsx'
import NotFound  from './views/NotFound.jsx';
import LoginContext from './required_context/LoginContext.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <div>
      <LoginContext>
        <Router>
          <Routes>
            <Route element={<Login/>} path='/' />
            <Route element={<Register/>} path='/signup'/>
            <Route element={<Home/>} path="/home" />
            <Route element={<NotFound/>} path="*"/>
          </Routes>
        </Router>
      </LoginContext>
    </div>

  );
}

export default App;
