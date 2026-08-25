import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// MUI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { useMediaQuery } from "@mui/material";

import "./SlideBar.css";

function SlideBar({ open, onClose, variant = "temporary" }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: t("home", "Home"),
      icon: <HomeOutlinedIcon />,
      route: "/home",
    },
    {
      label: t("myProfiles", "My Profiles"),
      icon: <PersonOutlineIcon />,
      route: "/profile",
    },
    {
      label: t("myAppointments", "My Appointments"),
      icon: <ContactPageOutlinedIcon />,
      route: "/my-appointments",
    },
    {
      label: t("allDoctors", "All Doctors"),
      icon: <GroupsOutlinedIcon />,
      route: "/doctorList",
    },
    {
      label: t("yourReports", "Your Reports"),
      icon: <NoteAddOutlinedIcon />,
      route: "/reports",
    },
    {
      label: t("healthProfile", "Health Profile"),
      icon: <FavoriteBorderOutlinedIcon />,
      route: "/health-profile",
    },
    {
      label: t("giveFeedback", "Give Feedback"),
      icon: <FeedbackOutlinedIcon />,
      route: "/feedback",
    },
    {
      label: t("support", "Support"),
      icon: <SupportAgentOutlinedIcon />,
      route: "/support",
    },
    {
      label: t("legalPage", "Legal Page"),
      icon: <GavelOutlinedIcon />,
      route: "/terms",
    },
  ];

  const handleNav = (route) => {
    if (isMobile) {
      onClose();
    }
    navigate(route);
  };

  const handleLogout = () => {
    if (isMobile) {
      onClose();
    }
    logout();
    navigate("/login");
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      variant={variant}
      ModalProps={variant === "persistent" ? { keepMounted: true } : {}}
      PaperProps={
        variant === "persistent"
          ? {
              sx: {
                boxShadow: "none",
                borderRight: "1px solid var(--border, #dde3ea)",
              },
            }
          : {}
      }
    >
      <Box className="slidebar-root">
        {/* User Section */}
        <Box className="slidebar-user">
          <Avatar className="slidebar-avatar">{getInitials(user?.name)}</Avatar>
          <Box className="slidebar-user-info">
            <h5 className="slidebar-name">{user?.name || "User"}</h5>
            <p className="slidebar-phone">{user?.phone || user?.email || ""}</p>
          </Box>
          <button
            className="slidebar-edit-btn"
            onClick={() => handleNav("/profile")}
          >
            <EditOutlinedIcon
              sx={{ fontSize: 16, color: "var(--blue, #3e7df5)" }}
            />
          </button>
        </Box>

        <Divider sx={{ mx: 2, borderColor: "var(--border)" }} />

        {/* Menu Items */}
        <List className="slidebar-list">
          {menuItems.map((item) => (
            <ListItem
              key={item.route}
              className={`slidebar-list-item ${location.pathname === item.route ? "active" : ""}`}
              onClick={() => handleNav(item.route)}
            >
              <ListItemIcon className="slidebar-icon">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Nunito, sans-serif",
                  color: "var(--text-primary)",
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Logout */}
        <button className="slidebar-logout-btn" onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: 18 }} />
          {t("logout", "Log out")}
        </button>

        <Box className="slidebar-safe-bottom" />
      </Box>
    </Drawer>
  );
}

export default SlideBar;
