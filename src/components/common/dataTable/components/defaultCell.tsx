import { Typography } from "@mui/material";

export const DefaultCell = ({ value }) => {
  return (
    <Typography
      component="span"
      variant="subtitle2"
      style={{ whiteSpace: "nowrap" }}
    >
      {value}
    </Typography>
  );
};
