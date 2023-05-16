import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import clsx from "clsx";
import { useStyles } from "./style";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "assets/images/easy_bankcore_Logo.png";
import Logo2 from "assets/images/bankcore_LOGO.svg";
import { Drawer, IconButton } from "@mui/material";
export const MyDrawer = ({
  open,
  handleDrawerClose,
  handleDrawerOpen,
  children,
}) => {
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
        <div>
          {open ? (
            <>
              <div style={{ marginLeft: "20px" }}>
                <img
                  src={Logo}
                  alt="Netbanking"
                  className={classes.logo}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("./");
                  }}
                />
                <p className={classes.version01}>V: 1.12.03.1</p>
              </div>
            </>
          ) : (
            <div style={{ marginLeft: "15px" }}>
              <img
                src={Logo2}
                alt="Ratnaafin"
                className={classes.logo2}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("./");
                }}
              />
              <p className={classes.version02}>V: 1.12.03.1</p>
            </div>
          )}
        </div>
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <ChevronRightIcon className={classes.chevronIcon} />
        </IconButton>

        <IconButton
          onClick={handleDrawerClose}
          className={classes.DrawerClose_icon}
        >
          <ChevronLeftIcon className={classes.chevronIcon} />
        </IconButton>
      </div>
      {children}
    </Drawer>
  );
};
