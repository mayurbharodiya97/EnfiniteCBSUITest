import { DateRange } from "./dateRange";
import { ValueRange } from "./valueRange";
import Grid from "@material-ui/core/Grid";

export const RangeFilter = (props) => {
  const { filterProps } = props;
  if (filterProps?.type === "date") {
    return <DateRange {...props} />;
  } else if (filterProps?.type === "value") {
    return <ValueRange {...props} />;
  } else {
    return (
      <Grid item md={6} sm={6} xs={12}>
        Range Component Type not set
      </Grid>
    );
  }
};
