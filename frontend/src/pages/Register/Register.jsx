import React from "react";
import "./Register.css";
import Lottie from "lottie-react";
import robotAnimation from "../../animations/robot.json";

// Handle Vite ESM/CJS interop mismatch where the imported object might contain the default export
const LottieComponent = Lottie.default || Lottie;

const Register = () => {
  return (
    <>
      <h1>Register page</h1>
      <div>
        <LottieComponent animationData={robotAnimation} loop={true} />
      </div>
    </>
  );
};
export default Register;

