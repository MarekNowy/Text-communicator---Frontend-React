import './App.css'
import LoginPanel from './Components/LoginPanel/loginPanel'
import SignUpPanel from './Components/SignUpPanel/signUpPanel'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <Router>
      <Routes>
      <Route path="/login" element={<LoginPanel/>}/>
      <Route path="/register" element={<SignUpPanel/>}/>
      </Routes>
    </Router>
  )
}

export default App
