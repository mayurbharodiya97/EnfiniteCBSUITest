import React from "react";
import { Grid, Skeleton } from "@mui/material";
const viewportWidth = window.innerWidth;

const positions = [
  {
    top: "30%",
    left: "15%",
    textWidth: (1200 / viewportWidth) * 100,
    subTextWidth: (675 / viewportWidth) * 100,
  },
  {
    top: "30%",
    left: "50%",
    textWidth: (2200 / viewportWidth) * 100,
    subTextWidth: (1400 / viewportWidth) * 100,
  },
  {
    top: "30%",
    left: "85%",
    textWidth: (1200 / viewportWidth) * 100,
    subTextWidth: (675 / viewportWidth) * 100,
  },
  {
    top: "58%",
    left: "25%",
    textWidth: (2300 / viewportWidth) * 100,
    subTextWidth: (1800 / viewportWidth) * 100,
  },
  {
    top: "58%",
    left: "75%",
    textWidth: (2300 / viewportWidth) * 100,
    subTextWidth: (1800 / viewportWidth) * 100,
  },
  {
    top: "85%",
    left: "16%",
    textWidth: (1200 / viewportWidth) * 100,
    subTextWidth: (675 / viewportWidth) * 100,
  },
  {
    top: "85%",
    left: "50%",
    textWidth: (2200 / viewportWidth) * 100,
    subTextWidth: (1400 / viewportWidth) * 100,
  },
  {
    top: "85%",
    left: "85%",
    textWidth: (1200 / viewportWidth) * 100,
    subTextWidth: (675 / viewportWidth) * 100,
  },
];

const App = () => (
  <Grid container>
    <Grid xs={12} sm={3} md={1} lg={1} xl={1}>
      <div style={{ position: "relative", width: "fit-content" }}>
        <Skeleton
          animation="pulse"
          variant="text"
          width={(5050 / viewportWidth) * 100}
          height={"30px"}
          style={{
            position: "absolute",
            top: "25px",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <Skeleton
          animation="pulse"
          variant="rectangular"
          width={(5315 / viewportWidth) * 100}
          height={240}
          style={{
            marginBottom: 10,
            backgroundColor: "rgba(0, 0, 0, 0.11)",
            borderRadius: 7,
          }}
        />

        {positions.map(({ top, left, textWidth, subTextWidth }, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top,
              left,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Skeleton
              animation="wave"
              variant="text"
              width={textWidth}
              height={25}
            />
            <Skeleton animation="wave" variant="text" width={subTextWidth} />
          </div>
        ))}
      </div>
    </Grid>
  </Grid>
);

export default App;
