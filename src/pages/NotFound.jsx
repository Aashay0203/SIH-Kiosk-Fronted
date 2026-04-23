import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="nf-root">
      <div className="nf-card">
        <span className="nf-emoji">🧭</span>
        <span className="nf-code">404</span>
        <h1 className="nf-title">Lost in the Clinic?</h1>
        <p className="nf-sub">This page doesn't exist or was moved.</p>
        <button className="nf-btn" onClick={() => navigate("/home")}>
          <HomeIcon fontSize="small" /> Go Home
        </button>
      </div>
    </div>
  );
}
