import { useState, FC, Fragment, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useStyles } from "./style";
import { OptionsProps } from "../types";
import { Typography } from "@material-ui/core";

const not = (a: OptionsProps[], b: OptionsProps[]) => {
  return a.filter(
    (one) => b.findIndex((current) => current?.value === one?.value) < 0
  );
};
const not2 = (b: any[], a: OptionsProps[]) =>
  b.filter((one) => a.findIndex((current) => current?.value === one) < 0);

const not3 = (b: any[], a: any[]) =>
  b.filter((one) => a.findIndex((current) => current === one) < 0);

const union = (a: any[], b: OptionsProps[]) => {
  return [
    ...a,
    ...not3(
      b.map((one) => one?.value),
      a
    ),
  ];
};

const intersection = (a: any[], b: OptionsProps[]) => {
  let result = a.filter(
    (value) => b.findIndex((one) => one?.value === value) !== -1
  );
  let result2 = b.filter((one) => result.indexOf(one?.value) >= 0);
  return result2;
};

export interface TransferListProps {
  label?: string;
  name?: string;
  leftOptions: OptionsProps[];
  rightOptions: OptionsProps[];
  leftOptionsLabel: string;
  rightOptionsLabel: string;
  valueSide: "left" | "right";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string | null;
  handleChange?: any;
  handleBlur?: any;
}

export const TransferList: FC<TransferListProps> = ({
  label = "",
  leftOptions,
  rightOptions,
  leftOptionsLabel,
  rightOptionsLabel,
  valueSide,
  disabled = false,
  error = false,
  readOnly = false,
  helperText = "",
  handleChange = () => {},
  handleBlur = () => {},
}) => {
  const classes = useStyles();
  const [checked, setChecked] = useState<any[]>([]);
  const [left, setLeft] = useState<OptionsProps[]>(leftOptions ?? []);
  const [right, setRight] = useState<OptionsProps[]>(rightOptions ?? []);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  /*eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    setLeft(leftOptions);
    setRight(rightOptions);
    if (valueSide === "left") {
      handleChange(leftOptions.map((one) => one.value));
    } else {
      handleChange(rightOptions.map((one) => one.value));
    }
  }, [leftOptions, rightOptions]);

  const handleToggle = (value: number) => () => {
    if (readOnly) {
      return;
    }
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: OptionsProps[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: OptionsProps[]) => () => {
    if (readOnly) {
      return;
    }
    if (numberOfChecked(items) === items.length) {
      setChecked(not2(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    if (readOnly) {
      return;
    }
    let rightResult = right.concat(leftChecked);
    let leftResult = not(left, leftChecked);
    setChecked(not2(checked, leftChecked));
    setLeft(leftResult);
    setRight(rightResult);
    if (valueSide === "left") {
      handleChange(leftResult.map((one) => one.value));
    } else {
      handleChange(rightResult.map((one) => one.value));
    }
  };

  const handleCheckedLeft = () => {
    if (readOnly) {
      return;
    }
    let leftResult = left.concat(rightChecked);
    let rightResult = not(right, rightChecked);
    setChecked(not2(checked, rightChecked));
    setLeft(leftResult);
    setRight(rightResult);
    if (valueSide === "left") {
      handleChange(leftResult.map((one) => one.value));
    } else {
      handleChange(rightResult.map((one) => one.value));
    }
  };

  const customList = (title: string, items: OptionsProps[], error: boolean) => {
    return (
      <Card style={error ? { borderBottom: "2px solid #f44336" } : undefined}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items.length && items.length !== 0
              }
              indeterminate={
                numberOfChecked(items) !== items.length &&
                numberOfChecked(items) !== 0
              }
              disabled={items.length === 0 || disabled}
              inputProps={{ "aria-label": "all items selected" }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
          {items.map((one) => {
            return (
              <ListItem
                key={one.value}
                role="listitem"
                button
                onClick={handleToggle(one.value)}
                dense={true}
                style={{ padding: "0px 16px" }}
                disabled={disabled}
              >
                <ListItemIcon>
                  <Checkbox
                    style={{ padding: "0px 8px" }}
                    checked={checked.indexOf(one.value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    disabled={disabled}
                  />
                </ListItemIcon>
                <ListItemText id={one.value} primary={one.label} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Card>
    );
  };

  return (
    <Fragment>
      <Typography variant="h6">{label}</Typography>
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        tabIndex={0}
        onBlur={(e) => {
          //@ts-ignore
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleBlur(e);
          }
        }}
      >
        <Grid item xs={5} md={5} sm={5}>
          {customList(leftOptionsLabel, left, error)}
        </Grid>
        <Grid item xs={2} md={2} sm={2}>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0 || disabled}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0 || disabled}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={5} md={5} sm={5}>
          {customList(rightOptionsLabel, right, error)}
        </Grid>
      </Grid>
      <FormHelperText disabled={disabled} error={error}>
        {helperText}
      </FormHelperText>
    </Fragment>
  );
};
