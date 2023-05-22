import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";

export const Announcement = ({ screenFlag = "" }) => {
  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Grid containerSize={100}>
        <Box
          sx={{
            height: "71px",
            backgroundColor:
              screenFlag === "Announcement"
                ? "var(--theme-color4)"
                : screenFlag === "Notes"
                ? "#E2ECFD"
                : screenFlag === "Tips"
                ? "#EDE7FD"
                : screenFlag === "Alert"
                ? "#FFE5EB"
                : null,
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <Grid item xl={12} lg={8} xs={12} sm={6} md={4}>
            <Typography
              // gutterBottom
              // variant="overline"
              style={{
                color: "#black",
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "24px",
                letterSpacing: "0.01em",
                marginBottom: "4px",
              }}
            >
              {`${screenFlag}`}
            </Typography>
            <Typography
              variant="h3"
              style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#949597",
                lineHeight: "27px",
              }}
            >
              {/* {`${body}`} */}
              {screenFlag === "Announcement"
                ? "Announcing New Features."
                : screenFlag === "Tips"
                ? "Be Preapared For Fruad."
                : screenFlag === "Notes"
                ? "Customer Queries Solve."
                : screenFlag === "Alert"
                ? "Low Balance Alert."
                : null}
              {/* {`${result?.data?.[0]?.BOX_BODY ?? body}`} */}
            </Typography>
          </Grid>

          <Grid
            style={{ display: "flex", justifyContent: "end" }}
            item
            xs={12}
            sm={6}
            md={4}
          >
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
              {screenFlag === "Announcement"
                ? "+7"
                : screenFlag === "Tips"
                ? "+7"
                : screenFlag === "Notes"
                ? "+7"
                : screenFlag === "Alert"
                ? "+7"
                : null}
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

              {screenFlag === "Announcement" ? (
                <VolumeUpRoundedIcon
                  style={{ color: " #4263C7", fontSize: "30px" }}
                />
              ) : screenFlag === "Tips" ? (
                <TipsAndUpdatesOutlinedIcon
                  style={{ color: "#885CF5", fontSize: "30px" }}
                />
              ) : screenFlag === "Notes" ? (
                <EventNoteOutlinedIcon
                  style={{ color: " #5290F5", fontSize: "30px" }}
                />
              ) : screenFlag === "Alert" ? (
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
        <Grid item xs={12} sm={12} md={12} style={{ margin: "5px" }}>
          <Box
            sx={{
              width: "100%",
              // maxWidth: 400,
              bgcolor: "background.paper",
              height: "25vh",
              overflowY: "auto",
              borderRadius: "10px",
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
                {/* {Array.from(Array(7)).map((_, index) => (
                  <ListItemData
                    key={"item?.value"}
                    name={"• Electronic payment service"}
                    disabled={false}
                    onClick={(event) => event}
                  />
                ))} */}
                <ListItemData
                  key={"item?.value"}
                  name={"• Electronic Payment Service"}
                  disabled={false}
                  onClick={(event) => event}
                />
                <ListItemData
                  key={"item?.value"}
                  name={"• Real Time Gross Settlement"}
                  disabled={false}
                  onClick={(event) => event}
                />
                <ListItemData
                  key={"item?.value"}
                  name={"• Electronic Fund Transfer"}
                  disabled={false}
                  onClick={(event) => event}
                />
                <ListItemData
                  key={"item?.value"}
                  name={"• Loan payments"}
                  disabled={false}
                  onClick={(event) => event}
                />
                <ListItemData
                  key={"item?.value"}
                  name={"• Electronic Clearing service"}
                  disabled={false}
                  onClick={(event) => event}
                />
                <ListItemData
                  key={"item?.value"}
                  name={"• Automatic Teller Machine"}
                  disabled={false}
                  onClick={(event) => event}
                />

                <ListItemData
                  key={"item?.value"}
                  name={"• Accepting deposits "}
                  disabled={false}
                  onClick={(event) => event}
                />
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
        button
        style={{
          padding: "8px 0 0 35px",
          color: "black",
          fontSize: "15px",
          backgroundColor: selected ? "#0000ff87" : "transparent",
        }}
        onClick={onClick}
      >
        <ListItemText primary={name} />
      </ListItem>
    </div>
  );
};
