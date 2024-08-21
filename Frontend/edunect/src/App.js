import './App.css';
import Login from "./views/login.jsx"
import Register from "./views/register.jsx"
import Home from './views/Home.jsx'
import NotFound from './views/NotFound.jsx';
import { LoginProvider } from './required_context/LoginContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './views/components/PrivateRoute.jsx';
import Footer from './views/components/Footer.jsx';
function App() {
  return (
    <div>
        <LoginProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Private routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Register />} />

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
