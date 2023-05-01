import "./style.css";
export const FullScreenLoader = () => {
  return (
    <div className="wrap-forloader">
      <div className="loading">
        <div className="bounceball"></div>
        <div className="text-forloader"> Loading...</div>
      </div>
    </div>
  );
};
