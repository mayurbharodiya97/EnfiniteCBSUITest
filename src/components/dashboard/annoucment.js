import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";

export const Announcement = ({
  title = "",
  body = "",
  screenFlag = "",
  count = "",
}) => {
  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Grid item xl={12} lg={12} sm={12} xs={12}>
        <Box
          sx={{
            height: "80px",
            backgroundColor:
              title === "Announcement"
                ? "var(--theme-color4)"
                : title === "Notes"
                ? "#E2ECFD"
                : title === "Tips"
                ? "#EDE7FD"
                : title === "Alert"
                ? "#FFE5EB"
                : null,
            borderRadius: "20px",
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <Grid item xl={4} lg={9} sm={9} xs={12}>
            <Typography
              // gutterBottom
              // variant="overline"
              style={{
                color: "#black",
                fontSize: "21px",
                fontWeight: "500",
                lineHeight: "24px",
                letterSpacing: "0.01em",
                marginBottom: "4px",
              }}
            >
              {`${title}`}
            </Typography>
            <Typography
              variant="h3"
              style={{
                fontSize: "16px",
                fontWeight: "400",
                color: "#949597",
                lineHeight: "27px",
              }}
            >
              {`${body}`}
              {/* {`${result?.data?.[0]?.BOX_BODY ?? body}`} */}
            </Typography>
          </Grid>

          <Grid style={{ display: "flex" }} item xl={12} lg={4} sm={5} xs={2}>
            <Box
              sx={{
                height: "38px",
                width: "38px",
                backgroundColor: "var(--theme-color3)",
                color: "var(--theme-color2)",
                borderRadius: "12px",
                padding: "10px",
                margin: "4px 14px 0 0",
              }}
            >
              {`${count}`}
            </Box>
            <IconButton
              color="inherit"
              style={{
                backgroundColor: "var(--theme-color2)",
                borderRadius: "10px",
                border: "0.4px solid rgba(66, 99, 199, 0.4)",
                boxShadow: "0px 5px 14px rgba(66, 99, 199, 0.2)",
                height: "45px",
                width: "45px",
              }}
            >
              {/* {`${icon}`} */}

              {screenFlag === "ANNOUNCEMENT" ? (
                <VolumeUpRoundedIcon
                  style={{ color: " #4263C7", fontSize: "30px" }}
                />
              ) : screenFlag === "TIPS" ? (
                <TipsAndUpdatesOutlinedIcon
                  style={{ color: "#885CF5", fontSize: "30px" }}
                />
              ) : screenFlag === "NOTES" ? (
                <EventNoteOutlinedIcon
                  style={{ color: " #5290F5", fontSize: "30px" }}
                />
              ) : screenFlag === "ALERT" ? (
                <WarningAmberRoundedIcon
                  style={{ color: " #FF4F79", fontSize: "30px" }}
                />
              ) : null}
            </IconButton>
          </Grid>
        </Box>
      </Grid>

      {/* {isLoading || isFetching ? (
                <LoaderPaperComponent />
              ) : ( */}
      {toggle ? (
        <Grid item xs={12} sm={12} md={12} style={{ marginTop: "15px" }}>
          <Box
            sx={{
              width: "100%",
              // maxWidth: 400,
              bgcolor: "background.paper",
              height: "26vh",
              overflowY: "auto",
              borderRadius: "20px",
              boxShadow: "0px 11px 20px rgba(226, 236, 249, 0.5)",
            }}
          >
            <nav aria-label="main mailbox folders">
              <List
                style={{
                  paddingTop: "0px",
                  paddingBottom: "0px",
                }}
              >
                {Array.from(Array(8)).map((_, index) => (
                  <ListItemData
                    key={"item?.value"}
                    name={"• Electronic payment service"}
                    disabled={false}
                    onClick={(event) => event}
                  />
                ))}
              </List>
            </nav>
          </Box>
        </Grid>
      ) : null}
      {/* )} */}
    </>
  );
};
export const ListItemData = ({ name, disabled, selected, onClick }) => {
  //@ts-ignore

  return (
    <div>
      <ListItem
        style={{
          padding: "8px 0 0 35px",
          color: "black",
          fontSize: "15px",
        }}
        onClick={onClick}
      >
        <ListItemText primary={name} />
      </ListItem>
    </div>
  );
};
