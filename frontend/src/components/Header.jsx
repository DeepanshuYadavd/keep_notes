import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header>
        <div className="logo">keep Notes</div>
        <nav>
          <Link to="/">
            <div>Home</div>
          </Link>

          <Link to="/product">
            <div>Product</div>
          </Link>

          <div>About</div>
          <div>Contact</div>
        </nav>

        <div className="auth">
          <div>Signin </div>
          <div>Signup</div>
        </div>
      </header>
    </>
  );
};

export default Header;
