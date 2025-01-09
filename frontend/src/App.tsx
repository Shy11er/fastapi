import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";
import MainPage from "./pages/Main";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/auth" element={<AuthPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
