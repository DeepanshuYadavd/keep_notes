import React from "react";
import { useAuth } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import LogoutIcon from "@mui/icons-material/Logout";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const Header = ({
  isCollapsed,
  setIsCollapsed,
  searchQuery,
  setSearchQuery,
  isListView,
  setIsListView,
}) => {
  const { user, logout } = useAuth();

  // Get user initial for avatar badge
  const initial = user?.userName ? user.userName.charAt(0).toUpperCase() : "U";

  return (
    <header className="premium-header">
      <div className="header-left">
        <button
          className="icon-button menu-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
        >
          <MenuIcon />
        </button>
        <div className="header-logo">
          <LightbulbIcon className="logo-icon animate-glow" />
          <span className="logo-text">Keep<span className="logo-subtext">Notes</span></span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        <button
          className="icon-button view-toggle"
          onClick={() => setIsListView(!isListView)}
          title={isListView ? "Grid view" : "List view"}
        >
          {isListView ? <GridViewIcon /> : <ViewStreamIcon />}
        </button>

        <div className="user-profile-wrapper">
          <div className="user-avatar" title={user?.userName || "User"}>
            {initial}
          </div>
          <div className="user-dropdown">
            <div className="dropdown-user-info">
              <span className="dropdown-username">{user?.userName}</span>
              <span className="dropdown-email">{user?.email}</span>
            </div>
            <hr className="dropdown-divider" />
            <button className="dropdown-item logout-btn" onClick={logout}>
              <LogoutIcon className="dropdown-icon" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
