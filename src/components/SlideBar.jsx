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

const menuItems = [
  {
    label: "Home",
    icon: <HomeOutlinedIcon />,
    route: "/home",
  },
  { label: "My Profiles", icon: <PersonOutlineIcon />, route: "/profile" },
  {
    label: "My Appointments",
    icon: <ContactPageOutlinedIcon />,
    route: "/my-appointments",
  },
  {
    label: "All Doctors",
    icon: <GroupsOutlinedIcon />,
    route: "/doctorList",
  },
  {
    label: "Your Reports",
    icon: <NoteAddOutlinedIcon />,
    route: "/reports",
  },
  {
    label: "Health Profile",
    icon: <FavoriteBorderOutlinedIcon />,
    route: "/health-profile",
  },

  {
    label: "Give Feedback",
    icon: <FeedbackOutlinedIcon />,
    route: "/feedback",
  },
  { label: "Support", icon: <SupportAgentOutlinedIcon />, route: "/support" },
  { label: "Legal Page", icon: <GavelOutlinedIcon />, route: "/terms" },
];

function SlideBar({ open, onClose, variant = "temporary" }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // from react-router-dom

  const handleNav = (route) => {
    if (isMobile) {
      onClose(); // Only close on mobile
    }
    navigate(route);
  };

  const handleLogout = () => {
    if (isMobile) {
      onClose(); // Only close on mobile
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
            <h5 className="slidebar-name">{user?.name || "Patient"}</h5>
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

        <Divider sx={{ mx: 2 }} />

        {/* Menu Items */}
        <List className="slidebar-list">
          {menuItems.map((item) => (
            <ListItem
              key={item.label}
              className={`slidebar-list-item ${location.pathname === item.route ? "active" : ""}`}
              onClick={() => handleNav(item.route)}
            >
              <ListItemIcon className="slidebar-icon">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Nunito, sans-serif",
                  color: "var(--black, #010101)",
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
          Log out
        </button>

        <Box className="slidebar-safe-bottom" />
      </Box>
    </Drawer>
  );
}

export default SlideBar;
