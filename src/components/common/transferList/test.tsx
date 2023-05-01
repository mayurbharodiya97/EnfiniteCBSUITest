import { Grid, TextField } from "@mui/material";
import { TransferList } from "./transferList";

const leftOptions = [
  {
    label: "Devarsh",
    value: 1,
  },
  {
    label: "Harsh",
    value: 2,
  },
  {
    label: "Ayush",
    value: 3,
  },
  {
    label: "Hriman",
    value: 4,
  },
  {
    label: "Aaryaman",
    value: 5,
  },
];

const rightOptions = [
  {
    label: "Shimoli",
    value: 6,
  },
  {
    label: "Nirali",
    value: 7,
  },
  {
    label: "Rimoni",
    value: 8,
  },
  {
    label: "Dvija",
    value: 9,
  },
  {
    label: "Urja",
    value: 10,
  },
];

const Demo = () => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <TransferList
          leftOptions={leftOptions}
          rightOptions={rightOptions}
          leftOptionsLabel="All Users "
          rightOptionsLabel="Selected Users"
          valueSide="right"
          handleChange={(values) => console.log(values)}
          handleBlur={(e) => console.log(e)}
          disabled={false}
        />
      </Grid>
      <Grid item md={6}>
        <TextField label="wow" />
      </Grid>
    </Grid>
  );
};

export default Demo;
