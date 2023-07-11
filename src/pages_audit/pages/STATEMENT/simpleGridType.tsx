import { Grid, Typography } from "@mui/material";

const SimpleGridType = ({ data }) => {
  const typographyStyle = [
    {
      padding: " 06px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "900",
    },
  ];

  const collapseableBox = {
    height: "auto",
    width: "100%",
    display: "flex",
    margin: "10px 0px",
  };

  return (
    <Grid container sx={collapseableBox}>
      {data?.detail?.map((item, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          xl={3}
          sx={{ display: "flex" }}
        >
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            lg={8}
            xl={8}
            sx={{
              height: "80%",
              borderRight: "1px solid",
              borderColor: "var(--theme-color4)",
              // borderRadius: "5px",
            }}
          >
            <Typography variant="h6" sx={typographyStyle}>
              {item.label}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                padding: " 06px",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "900",
                color: "var(--theme-color1)",
              }}
            >
              {" "}
              {item?.currency && <>&#8377;</>} {item.value}
            </Typography>
            {item.countLabel && (
              <>
                {" "}
                <Typography variant="h6" sx={typographyStyle}>
                  {item.countLabel}
                </Typography>
                <Typography variant="h5" sx={typographyStyle}>
                  {item.count}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SimpleGridType;
