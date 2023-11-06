import { Grid, GridProps, Typography, TypographyProps } from "@mui/material";
import { FC, Fragment } from "react";

export interface AllTypographyProps {
  TypographyProps?: TypographyProps;
  GridProps?: GridProps;
  name: string;
  label: string;
}

const MyTypography: FC<AllTypographyProps> = ({
  name,
  TypographyProps,
  GridProps,
  label,
}) => {
  return (
    <Fragment key={name}>
      <Grid {...GridProps}>
        {/* <Typography {...TypographyProps}>{label}</Typography> */}
        <Typography variant="h6" style={undefined} {...TypographyProps}>
          {label}
        </Typography>
      </Grid>
    </Fragment>
  );
};

export default MyTypography;
