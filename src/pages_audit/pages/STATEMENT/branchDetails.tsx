import { Grid, Typography } from "@mui/material";

const BranchDetails = ({
  collapseableBox,
  halfMainGrid,
  childGridFour,
  typographyGridForLable,
  typographyLable,
  colonStyle,
  childGridEight,
  typographyForValue,
  branchDetailsDataLeft,
  branchDetailsDataRight,
}) => {
  return (
    <Grid container sx={collapseableBox}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        xl={6}
        sx={{ ...halfMainGrid, height: "10rem" }}
      >
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={childGridFour}>
          {branchDetailsDataLeft?.map((items) => (
            <Grid sx={typographyGridForLable}>
              {" "}
              <Typography sx={typographyLable}>{items.label}</Typography>
              <Typography sx={colonStyle}>:</Typography>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={childGridEight}>
          {branchDetailsDataLeft?.map((items) => (
            <Typography sx={typographyForValue}>{items.value}</Typography>
          ))}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        xl={6}
        sx={{ ...halfMainGrid, height: "10rem" }}
      >
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={childGridFour}>
          {branchDetailsDataRight?.map((items) => (
            <Grid sx={typographyGridForLable}>
              {" "}
              <Typography sx={typographyLable}>{items.label}</Typography>
              <Typography sx={colonStyle}>:</Typography>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={childGridEight}>
          {branchDetailsDataRight?.map((items) => (
            <Typography sx={typographyForValue}>{items.value}</Typography>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BranchDetails;
