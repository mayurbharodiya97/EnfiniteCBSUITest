import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

export const CircularProgressWithLabel = ({
  value,
  variant,
  interval,
  pause,
  resume,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant={variant} value={value} size="2rem" />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#80808042",
          borderRadius: "50%",
        }}
        onMouseOver={() => setIsMouseOver(true)}
        onMouseOut={() => setIsMouseOver(false)}
      >
        {isMouseOver ? (
          <IconButton
            onClick={() => {
              if (isPlaying) {
                pause();
                setIsPlaying(false);
              } else {
                resume();
                setIsPlaying(true);
              }
            }}
            style={{ opacity: 0.6 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        ) : isPlaying ? (
          <Typography variant="caption" component="div" color="textSecondary">
            {interval ?? value}
          </Typography>
        ) : (
          <IconButton
            onClick={() => {
              if (isPlaying) {
                pause();
                setIsPlaying(false);
              } else {
                resume();
                setIsPlaying(true);
              }
            }}
            style={{ opacity: 0.6 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        )}
      </div>
    </div>
  );
};
