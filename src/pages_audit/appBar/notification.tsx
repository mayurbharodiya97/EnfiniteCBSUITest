import { useState } from "react";
import { useStyles } from "./style";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Badge, Box, Grid, Popover } from "@mui/material";

export const Notification_App = () => {
  //   const classes = useStyles();
  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        style={{
          backgroundColor: "rgba(235, 237, 238, 0.45)",
          borderRadius: "10px",
        }}
      >
        <Badge badgeContent={3} color="info">
          <NotificationsNoneIcon />
        </Badge>
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
        {/* <div style={{ padding: "16px" }}>
              <Typography variant="h6" className={classes.userName}>
                {authController?.authState?.user?.name}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                {authController?.authState?.companyName}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                Role: {authController?.authState?.roleName}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                User ID : {authController?.authState?.user?.id}
              </Typography>
            </div>

            <div style={{ padding: "16px" }}>
              <Button
                onClick={() => {
                  authController?.logout();
                  handleClose();
                }}
                fullWidth
                variant="outlined"
                style={{ background: "var(--theme-color1)", color: "white" }}
              >
                Logout
              </Button>
            </div> */}

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
              <Box fontSize={20}>Inquiry</Box>
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
      </Popover>
    </>
  );
};
