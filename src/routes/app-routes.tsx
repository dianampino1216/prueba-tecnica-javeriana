import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home-page";
import { ProgramasPage } from "../pages/programs-page";
import { DetalleProgramaPage } from "../pages/detail-program-page";
import { AdminLeadsPage } from "../pages/admin-leads-page";

// App use react-router to handle routing in the application
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programas" element={<ProgramasPage />} />
        <Route path="/programa/:id" element={<DetalleProgramaPage />} />
        <Route path="/admin" element={<AdminLeadsPage />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}