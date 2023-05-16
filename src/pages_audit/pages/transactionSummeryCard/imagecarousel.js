import React, { useRef } from "react";
import Mycard from "./mycard";
import "./imagecarousel.css";

const Imagecarousel = () => {
  const boxRef = useRef(null);

  const btnpressprev = () => {
    const box = boxRef.current;
    const width = box.clientWidth;
    box.scrollLeft = box.scrollLeft - width;
    console.log(box.current, box.clientWidth, box.scrollLeft);
  };

  const btnpressnext = () => {
    const box = boxRef.current;
    const width = box.clientWidth;
    box.scrollLeft = box.scrollLeft + width;
  };

  return (
    <div className="product-carousel">
      <button className="pre-btn" onClick={btnpressprev}>
        <p>&gt;</p>
      </button>
      <button className="next-btn" onClick={btnpressnext}>
        <p>&lt;</p>
      </button>

      <div className="product-container" ref={boxRef}>
        <Mycard cardno="1" />
        <Mycard cardno="2" />
        <Mycard cardno="3" />
        <Mycard cardno="4" />
        <Mycard cardno="5" />
        <Mycard cardno="6" />
        <Mycard cardno="7" />
        <Mycard cardno="8" />
        <Mycard cardno="9" />
        <Mycard cardno="10" />
        <Mycard cardno="11" />
        <Mycard cardno="12" />
      </div>
    </div>
  );
};

export default Imagecarousel;
