import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";
import MainPage from "./pages/Main";
import PrivateRoute from "./PrivateRoute";

const App: React.FC = () => {
    return (
        <Router>
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
        </Router>
    );
};

export default App;
