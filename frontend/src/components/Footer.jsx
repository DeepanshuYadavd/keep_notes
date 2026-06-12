import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer>copyright reserved by @deepanshu {year}</footer>
    </>
  );
};

export default Footer;
