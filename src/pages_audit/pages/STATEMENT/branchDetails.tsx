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
  branchDetailsData,
}) => {
  return (
    <Grid container sx={{ marginBottom: "10px" }}>
      {branchDetailsData?.map((item, index) => (
        <>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            key={item.label}
            style={{
              borderBottom: "1px solid var(--theme-color4)",
              padding: "10px",
            }}
          >
            <Grid container>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography
                  sx={{ fontWeight: "bold", fontFamily: "Roboto, sans-serif" }}
                >
                  {item?.label}
                </Typography>
                <Typography
                  sx={{ fontWeight: "bold", fontFamily: "Roboto, sans-serif" }}
                >
                  :
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography sx={{ padding: "0px 10px" }}>
                  {item?.value}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {branchDetailsData?.length === index + 1 && index % 2 == 0 ? (
            <Grid
              item
              xs={0}
              sm={0}
              md={6}
              lg={6}
              xl={6}
              key={item.label}
              style={{ borderBottom: "1px solid var(--theme-color4)" }}
            ></Grid>
          ) : (
            <></>
          )}
          {/* <Grid item>
          <Divider />
        </Grid> */}
        </>
      ))}
    </Grid>
  );
};

export default BranchDetails;
