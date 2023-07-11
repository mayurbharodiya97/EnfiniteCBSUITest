import { useContext, useState } from "react";
import { useStyles } from "./style";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Badge, Box, Grid, List, ListItemButton, Popover } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
export const Notification_App = () => {
  //   const classes = useStyles();
  const [anchorEl1, setAnchorEl1] = useState(null);
  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };
  let listitem = [
    {
      title: "Customer Id - 563537",
      time: " 15 min ago",
      content:
        " Customer id is successfully Authorised by parag on 12/06/2023 12:05:46",
      Icon: "cust",
    },
    {
      title: "Customer Id - 100537",
      time: " 12 min ago",
      content:
        " Customer id is successfully Authorised by ncm on 23/05/2023 02:12:46",
      Icon: "cust",
    },
    {
      title: "Customer Id - 223456",
      time: " 10 min ago",
      content:
        "Fresh Customer successfully Authorised by ncm on 23/05/2023 02:18:46",
      Icon: "cust",
    },
    {
      title: "Account - 132099001012560 Cash Withdrawal",
      time: " 10 min ago",
      content:
        " ₹ 20,000 Cash withdrawal is authorised by vns on 23/05/2023 02:25:46",
      Icon: "account",
    },
    {
      title: "Account - 132099001012560 Cash Receipt",
      time: " 10 min ago",
      content:
        " ₹ 80,000 Cash Receipt -PAN: BKIPS5784A is authorised by vns on 23/05/2023 02:25:46",
      Icon: "account",
    },
    {
      title: "Fresh Time Deposit - 132099201012560 ",
      time: " 10 min ago",
      content:
        "FD no: 23123 for  ₹ 1,00,000 is send to authorisation by vns on 23/05/2023 02:25:46",
      Icon: "fresh",
    },
  ];
  return (
    <>
      {/* {listitem.map((item) => {
        item.Icon === "account" ? (
          <NotificationsNoneIcon
            fontSize="small"
            sx={{ color: "var(--theme-color3)" }}
          />
        ) : null;
      })} */}
      <IconButton
        color="inherit"
        onClick={handleClick}
        style={{
          backgroundColor: "rgba(235, 237, 238, 0.45)",
          borderRadius: "10px",
          height: "30px",
          width: "30px",
        }}
      >
        <NotificationsNoneIcon
          fontSize="small"
          sx={{ color: "var(--theme-color3)" }}
        />
      </IconButton>
      <Popover
        anchorEl={anchorEl1}
        open={Boolean(anchorEl1)}
        onClose={handleClose}
        elevation={8}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: { maxWidth: "370px", width: "370px" },
        }}
      >
        {/* {Array.from(Array(6)).map((_, index) => (
          <List disablePadding key={index}>
            <ListItemButton
              sx={{
                padding: "0px",
              }}
            >
              <Grid container p={1} spacing={1}>
                <Grid
                  item
                  xs={1}
                  m={1}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "5px",
                  }}
                >
                  <TaskAltIcon
                    style={{ width: "25px", height: "25px", color: "green" }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Box
                    sx={{
                      my: 0.5,
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 500,
                    }}
                  >
                    <Box fontSize={20}>Lead</Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#949597",
                        fontSize: "12px",
                      }}
                    >
                      15 min ago
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: "11px" }}>
                    CAM Generated successfully with Lead Code 00125_17012023 and
                    Version No. 1 ok\n.
                  </Box>
                </Grid>
              </Grid>
            </ListItemButton>
          </List>
        ))} */}
        {listitem.map((data, index) => (
          <List disablePadding key={index}>
            <ListItemButton
              sx={{
                padding: "0px",
                backgroundColor: index % 2 === 0 ? "#E2ECFD" : "#ffeff3", // Alternating background color
              }}
            >
              <Grid container p={1} spacing={1}>
                <Grid
                  item
                  xs={1}
                  m={1}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "5px",
                  }}
                >
                  {data.Icon === "account" ? (
                    <AccountCircleIcon
                      style={{
                        width: "25px",
                        height: "25px",
                        // color: "#40A0ED",
                      }}
                    />
                  ) : data.Icon === "cust" ? (
                    <PersonIcon
                      style={{
                        width: "25px",
                        height: "25px",
                        // color: "rgb(128 2 2)",
                      }}
                    />
                  ) : data.Icon === "fresh" ? (
                    <TaskAltIcon style={{ width: "25px", height: "25px" }} />
                  ) : null}
                </Grid>
                <Grid item xs={10}>
                  <Box
                    sx={{
                      my: 0.5,
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 500,
                    }}
                  >
                    <Box fontSize={15}>{data.title}</Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#949597",
                        fontSize: "11px",
                        justifyContent: "end",
                        alignSelf: "baseline",
                        width: "90px",
                      }}
                    >
                      {data.time}
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: "11px" }}>{data.content}</Box>
                </Grid>
              </Grid>
            </ListItemButton>
          </List>
        ))}
      </Popover>
    </>
  );
};
