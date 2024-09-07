import { Grid, GridProps, Hidden, HiddenProps } from "@mui/material";
import { FC, Fragment } from "react";
import { UseFieldHookProps, useField } from "packages/form";

export interface SpacerProps {
  HiddenProps?: HiddenProps;
  GridProps?: GridProps;
  name: string;
  componentType?: string;
}

export type MySpacerProps = UseFieldHookProps & SpacerProps;

const Spacer: FC<MySpacerProps> = ({
  name: fieldName,
  HiddenProps,
  GridProps,
  shouldExclude,
  fieldKey: fieldID,
  dependentFields,
  componentType,
}) => {
  const { name, excluded } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    shouldExclude,
    componentType,
  });

  if (excluded) {
    return null;
  }

  return (
    <Fragment key={name}>
      <Hidden {...HiddenProps}>
        <Grid item={true} {...GridProps} />
      </Hidden>
    </Fragment>
  );
};

export default Spacer;
