import { Grid, Typography } from "@mui/material";

const AccountStatementDetails = ({ collapseableBox, statementData }) => {
  const typographyStyle = [
    {
      padding: " 06px",
      fontFamily: "Josefin Sans sans-serif",
      fontWeight: "900",
    },
  ];

  return (
    <Grid container sx={collapseableBox}>
      {statementData.map((item, index) => (
        <Grid key={index} item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Typography variant="h6" sx={typographyStyle}>
            {item.label}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              padding: " 06px",
              fontFamily: "Josefin Sans sans-serif",
              fontWeight: "900",
              color: "var(--theme-color1)",
            }}
          >
            {" "}
            &#8377; {item.amount}
          </Typography>
          {item.countLabel && (
            <>
              <Typography variant="h6" sx={typographyStyle}>
                {item.countLabel}
              </Typography>
              <Typography variant="h5" sx={typographyStyle}>
                {item.count}
              </Typography>
            </>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default AccountStatementDetails;
