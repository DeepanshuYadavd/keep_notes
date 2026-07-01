import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const showToast = (message, type = "info", duration = 4000, action = null) => {
    if (timeoutId) clearTimeout(timeoutId);
    setToast({ message, type, action });
    
    const id = setTimeout(() => {
      setToast(null);
    }, duration);
    setTimeoutId(id);
  };

  const closeToast = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      {toast && (
        <div className={`premium-toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✗"}
              {toast.type === "info" && "ℹ"}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <div className="toast-actions">
            {toast.action && (
              <button
                className="toast-action-btn"
                onClick={() => {
                  toast.action.onClick();
                  closeToast();
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button className="toast-close-btn" onClick={closeToast}>
              &times;
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastContext;
