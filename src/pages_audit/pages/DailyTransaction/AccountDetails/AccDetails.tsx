import React from "react";

const AccDetails = () => {
  return (
    <div
      style={{
        height: "45vh",
        boxShadow: "0px 1px 4px -1px #999999",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <div
        style={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          margin: "10px",
          padding: "10px",
          width: "400px",
        }}
      >
        <h2>Personal Information</h2>
        <div>Name</div>
        <div>Test Customer</div>
        <div>Address</div>
        <div>Test Address</div>
      </div>
    </div>
  );
};

export default AccDetails;
