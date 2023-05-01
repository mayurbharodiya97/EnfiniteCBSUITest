import { useNavigate } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
// import Logo from "assets/images/netbankinglogo.png";
import Logo from "assets/images/EasyNetPro.png";

import { useStyles } from "./style";

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
          alt="Netbanking"
          className={classes.logo}
          onClick={(e) => {
            e.preventDefault();
            navigate("./dashboard");
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
