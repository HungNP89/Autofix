import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Helpers/ProtectedRoute";
import { BrowserRouter } from "react-router-dom";
const Contact = lazy(() => import('./Pages/Contact'))
const About = lazy(() => import('./Pages/About'))
//const BookingHistory = lazy(() => import('./Pages/BookingHistory'));
const MainPage = lazy(() => import('./Pages/MainPage'));
const Login = lazy(() => import('./Authentication/Login'));
const Register = lazy(() => import('./Authentication/Register'));
// import MainPage from "./Pages/MainPage";
const BookingDetail = lazy(() => import( "./Pages/BookingDetail"));
const AdminLogin = lazy(() => import("./Admin/AdminLogin"));
const AdminPanel = lazy(() => import("./Admin/AdminPanel"));
const AdminProcessed = lazy(() => import("./Admin/AdminProcessed"));
import {GoogleOAuthProvider } from  '@react-oauth/google';
const LandingPage = lazy(() => import( "./Pages/LandingPage"));
const Cancelled = lazy(() => import("./Admin/Cancelled")) ;
const Verify = lazy(() => import('./Authentication/Verify'));
const BookingHistory = lazy(() => import('./Pages/BookingHistory'));
function App() {
  return (
 
    <BrowserRouter>
    <Suspense>
      <Routes>
        <Route path="/login" element={ <GoogleOAuthProvider clientId="1068350481405-tcc697qmeg9dpt12nv2nh4rqb3q4e7c8.apps.googleusercontent.com"><Login /></GoogleOAuthProvider>} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<ProtectedRoute requiredRole='user'><MainPage /></ProtectedRoute>} />
        <Route path="/main/detail" element={<ProtectedRoute requiredRole='user'><BookingDetail /></ProtectedRoute>} />
        <Route path="/about" element={<About />}/>
        <Route path="contact" element={<Contact />} />
        <Route path="/main/history" element={<ProtectedRoute requiredRole='user'><BookingHistory/></ProtectedRoute>}/>
        <Route path="/autofix" element={<LandingPage/>} />
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/panel" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>}/>
        <Route path="/panel/processed" element={<ProtectedRoute requiredRole="admin"><AdminProcessed /></ProtectedRoute>}/>
        <Route path="/panel/cancel" element={<ProtectedRoute requiredRole="admin"><Cancelled/></ProtectedRoute>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
