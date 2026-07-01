import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer>copyright reserved &copy; {year}</footer>
    </>
  );
};

export default Footer;
