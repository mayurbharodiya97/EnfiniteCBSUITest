import { Chip, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { format } from "date-fns";
// const theme = createTheme();

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export const TableFilterStatusBar = ({
  dense,
  filters,
  setAllFilters,
  gotoPage,
  setSortBy,
}) => {
  const classes = useStyles();
  const handleDelete = (id) => {
    let newFilter = filters.filter((one) => one.id !== id);
    setAllFilters(newFilter);
    gotoPage(0);
    setSortBy([]);
  };
  if (Array.isArray(filters) && filters.length <= 0) {
    return null;
  }
  return (
    <Toolbar
      component="ul"
      className={classes.root}
      variant={dense ? "dense" : "regular"}
    >
      <li>
        <Typography variant="h6" color="secondary">
          Applied Filters:{" "}
        </Typography>
      </li>
      {filters.map((one: any) => {
        //console.log(one);
        return (
          <li key={one?.id}>
            <Chip
              label={computeFilterLabel(
                one?.value?.condition,
                one?.value?.columnName,
                one?.value?.value,
                one?.value?.label
              )}
              onDelete={() => handleDelete(one?.id)}
              className={classes.chip}
              variant="outlined"
              color="secondary"
            />
          </li>
        );
      })}
    </Toolbar>
  );
};

const computeFilterLabel = (condition, columnName, value, label) => {
  switch (condition) {
    case "equal":
      return `${columnName} = ${isDateThenFormat(value)}`;
    case "between":
      return `${columnName} between ${isDateThenFormat(
        value[0]
      )} and ${isDateThenFormat(value[1])}`;
    case "in":
      return `${columnName} in ${isLabelThenDisplay(value, label)}`;
    case "contains":
      return `${columnName} like ${value}`;
    case "endsWith":
      return `${columnName} ends with ${value}`;
    case "startsWith":
      return `${columnName} starts with ${value}`;
    default:
      return `${columnName}`;
  }
};

const isDateThenFormat = (value) => {
  let myDate = new Date(value);
  //@ts-ignore
  if (!isNaN(myDate) && isNaN(value)) {
    return format(myDate, "dd/MM/yyyy");
  } else {
    return value;
  }
};

const isLabelThenDisplay = (value, label) => {
  if (
    Array.isArray(label) &&
    Array.isArray(value) &&
    value.length === label.length
  ) {
    return JSON.stringify(label).replaceAll(/"/g, " ");
  } else {
    return JSON.stringify(value).replaceAll(/"/g, " ");
  }
};
