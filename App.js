import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddEvent from "./AddEvent";
import Events from "./Events";
import RegisteredStudents from "./RegisteredStudents";
import RegisterPage from "./RegisterPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* HOME */}
        <Route path="/" element={
          <div>
            <h1>🎉 Event Management System</h1>
            <AddEvent />
            <Events />
            <RegisteredStudents />
          </div>
        } />

        {/* REGISTER PAGE */}
        <Route path="/register/:id" element={<RegisterPage />} />

      </Routes>
    </Router>
  );
}

export default App;