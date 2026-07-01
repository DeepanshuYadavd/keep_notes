import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListView, setIsListView] = useState(false);

  return (
    <div className="premium-app-layout">
      <Header
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isListView={isListView}
        setIsListView={setIsListView}
      />
      <div className="layout-body">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <main className="layout-content">
          <div className="workspace-container">
            <Outlet context={{ searchQuery, isListView }} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
