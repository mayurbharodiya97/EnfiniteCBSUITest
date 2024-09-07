export const HeaderColumnCell = ({
  column: { columnName, getResizerProps },
}) => {
  return (
    <>
      <span
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {columnName}
      </span>

      <div
        {...getResizerProps([
          {
            style: {
              display: "inline-block",
              position: "absolute",
              right: "-5px",
              top: "0",
              padding: "0 5px",
              zIndex: 1,
            },
          },
        ])}
      >
        <div
          style={{
            height: "35px",
            width: "6px",
            backgroundColor: "#888",
          }}
        ></div>
      </div>
    </>
  );
};
