import React from "react";
import { NavLink } from "react-router-dom";
import LightbulbIcon from "@mui/icons-material/LightbulbOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import ArchiveIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { path: "/", label: "Notes", icon: <LightbulbIcon className="icon-svg" /> },
    { path: "/reminders", label: "Reminders", icon: <NotificationsIcon className="icon-svg" /> },
    { path: "/archive", label: "Archive", icon: <ArchiveIcon className="icon-svg" /> },
    { path: "/trash", label: "Trash", icon: <DeleteIcon className="icon-svg" /> },
  ];

  return (
    <aside className={`premium-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <div className="sidebar-icon-wrapper">{item.icon}</div>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
