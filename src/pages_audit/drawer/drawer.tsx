import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import clsx from "clsx";
import Logo from "assets/images/cbsenfinitylogo.png";

import { useStyles } from "./style";
import { Divider, Drawer, IconButton } from "@mui/material";

export const MyDrawer = ({ open, handleDrawerClose, children }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <img
          src={Logo}
          alt="CBS"
          className={classes.logo}
          onClick={(e) => {
            e.preventDefault();
            navigate("./");
          }}
        />
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon style={{ color: "var(--theme-color1)" }} />
        </IconButton>
      </div>
      <Divider className={classes.hrCSS} />
      {children}
    </Drawer>
  );
};
