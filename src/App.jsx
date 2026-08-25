import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { Box, CircularProgress } from "@mui/material";
import AppLayout from "./components/Applayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup"));
const DoctorSignup = lazy(() => import("./pages/DoctorSignUp"));
const DoctorList = lazy(() => import("./pages/DoctorList"));
const AppointmentBook = lazy(() => import("./pages/AppointmentBook"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const MyAppointment = lazy(() => import("./pages/MyAppointment.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Report = lazy(() => import("./pages/Report.jsx"));
const ReportUpload = lazy(() => import("./pages/ReportUpload.jsx"));
const ReportDetails = lazy(() => import("./pages/ReportDetails.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const HealthProfileSetup = lazy(
  () => import("./pages/HealthProfileSetup/HealthProfileSetup.jsx"),
);
const HealthProfile = lazy(
  () => import("./pages/HealthProfile/HealthProfile.jsx"),
);
const LiveQueue = lazy(() => import("./pages/LiveQueue"));
const DoctorHome = lazy(() => import("./pages/DoctorHome"));
const PatientDetail = lazy(() => import("./pages/PatientDetails"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const Support = lazy(() => import("./pages/Support.jsx"));
const GiveFeedback = lazy(() => import("./pages/GiveFeedback.jsx"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const LegalPages = lazy(() => import("./pages/LegalPages.jsx"));
const KioskStart = lazy(() => import("./pages/Kiosk/KioskStart.jsx"));
const KioskConverse = lazy(() => import("./pages/Kiosk/KioskConverse.jsx"));
const KioskDocUpload = lazy(() => import("./pages/Kiosk/KioskDocUpload.jsx"));
const KioskSummary = lazy(() => import("./pages/Kiosk/KioskSummary.jsx"));

function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#e8ecee",
      }}
    >
      <CircularProgress sx={{ color: "#3e7df5" }} />
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/doctorSignup" element={<DoctorSignup />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
                <Route path="/doctorList" element={<DoctorList />} />
                <Route
                  path="/booking/:doctorId"
                  element={<AppointmentBook />}
                />
                <Route path="/payment" element={<Payment />} />
                <Route path="/my-appointments" element={<MyAppointment />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/reports/upload" element={<ReportUpload />} />
                <Route path="/reports/:id" element={<ReportDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/health-profile" element={<HealthProfile />} />
                <Route
                  path="/health-profile/setup"
                  element={<HealthProfileSetup />}
                />
                <Route path="/doctor/home" element={<DoctorHome />} />
                <Route
                  path="/doctor/patient/:appointmentId"
                  element={<PatientDetail />}
                />
                <Route path="/queue/:appointmentId" element={<LiveQueue />} />
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/support" element={<Support />} />
                <Route path="/feedback" element={<GiveFeedback />} />
                <Route path="/terms" element={<LegalPages />} />
                <Route path="/kiosk/start" element={<KioskStart />} />
                <Route
                  path="/kiosk/:sessionId/converse"
                  element={<KioskConverse />}
                />
                <Route
                  path="/kiosk/:sessionId/docs"
                  element={<KioskDocUpload />}
                />
                <Route
                  path="/kiosk/:sessionId/summary"
                  element={<KioskSummary />}
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
