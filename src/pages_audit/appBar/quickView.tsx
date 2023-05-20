import { useState, useContext } from "react";
// import { useStyles } from "./style";
import quickview from "assets/images/Quick_view.png";
import IconButton from "@mui/material/IconButton";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import { AuthContext } from "../auth";
import {
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Popover,
} from "@mui/material";

export const Quick_View = () => {
  //   const classes = useStyles();
  const authController = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickd = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClickd}
        style={{
          backgroundColor: "rgba(235, 237, 238, 0.45)",
          borderRadius: "10px",
          height: "30px",
          width: "30px",
        }}
      >
        <SensorsOutlinedIcon
          fontSize="small"
          sx={{ color: "var(--theme-color3)" }}
        />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
          style: {
            maxWidth: "680px",
            width: "680px",
          },
        }}
      >
        <Box m={2}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={5}>
              <Button sx={{ p: 0 }}>
                <img
                  src={quickview}
                  style={{
                    background: "#ECEFF9",
                    borderRadius: "12.7947px",
                  }}
                  alt=""
                />
              </Button>
            </Grid>
            <Grid item xs={7}>
              <Grid
                container
                rowSpacing={1}
                pl={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <List
                    sx={{
                      listStyleType: "disc",
                      "& .MuiListItem-root": {
                        pt: 1,
                        display: "list-item",
                      },
                    }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton>Switch Branch</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Profile</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Chat</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Customer</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>User</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Setting</ListItemButton>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List
                    sx={{
                      listStyleType: "disc",
                      "& .MuiListItem-root": {
                        pt: 1,
                        display: "list-item",
                      },
                    }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton>Table</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Chart</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Plugins</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>Contact Us</ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          authController?.logout();
                          // handleClose();
                        }}
                      >
                        Log Out
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
