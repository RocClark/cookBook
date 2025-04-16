"use client";
import React from "react";

const TestDebugger: React.FC = () => {
  const handleClick = () => {
    // Place a breakpoint here
    console.log("Debugging on the client side!");
    alert("Client-side debugging in progress!");
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-red-500">Test Debugger</h1>
      <button
        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        onClick={handleClick}
      >
        Trigger Debugger
      </button>
    </div>
  );
};

export default TestDebugger;
