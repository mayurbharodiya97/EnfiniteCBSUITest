import { Grid, GridProps, Hidden, HiddenProps } from "@mui/material";
import { FC, Fragment } from "react";

export interface SpacerProps {
  HiddenProps?: HiddenProps;
  GridProps?: GridProps;
  name: string;
}

const Spacer: FC<SpacerProps> = ({ name, HiddenProps, GridProps }) => {
  return (
    <Fragment key={name}>
      <Hidden {...HiddenProps}>
        <Grid item={true} {...GridProps} />
      </Hidden>
    </Fragment>
  );
};

export default Spacer;
