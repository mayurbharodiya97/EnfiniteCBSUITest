import { useState, useContext } from "react";
import { useStyles } from "./style";
import quickview from "assets/images/Quick_view.png";
import IconButton from "@mui/material/IconButton";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import {
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Popover,
} from "@mui/material";
import { useQuery } from "react-query";
import * as API from "./api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { CustomIconButton } from "components/styledComponent/button/button";

export const Quick_View = () => {
  const authController = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, refetch } = useQuery<any, any>(
    ["GETQUICKACCESSVIEW"],
    () =>
      API.getQuickView({
        userID: authController?.authState?.user?.id,
        branchCode: authController?.authState?.user?.branchCode,
        companyID: authController?.authState?.companyID,
      })
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickd = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <CustomIconButton
        // color="inherit"
        renderIcon="SensorsOutlined"
        onClick={handleClickd}
        sx={{
          backgroundColor: anchorEl
            ? "var(--theme-color3)"
            : "rgba(235, 237, 238, 0.45)",
          borderRadius: "10px",
          height: "30px",
          width: "30px",
          color: anchorEl ? "var(--theme-color2)" : "var(--theme-color3)",
          "&:hover": {
            background: "var(--theme-color2)",
            borderRadius: "10px",
            transition: "all 0.2s ease 0s",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            "& .MuiSvgIcon-root": {
              height: "32px",
              width: "32px",
              transition: "all 0.2s ease 0s",
              padding: "4px",
            },
          },
        }}
      >
        {/* <SensorsOutlinedIcon
          fontSize="small"
          sx={{
            color: anchorEl ? "var(--theme-color2)" : "var(--theme-color3)",
          }}
        /> */}
      </CustomIconButton>
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
            maxWidth: "580px",
            width: "580px",
          },
        }}
        // classes={{ paper: classes.popover }}
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
                sx={{
                  display: "flex",
                  flexFlow: "column wrap",
                  gap: "0 30px",
                  height: 190, // set the height limit to your liking
                  overflow: "auto",
                  paddingLeft: "20px ",
                }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ pt: 1, display: "list-item" }}
                    onClick={() => {
                      navigate("/cbsenfinity/change-branch");
                    }}
                  >
                    Switch Branch
                  </ListItemButton>
                </ListItem>
                {isLoading || isError ? (
                  <></>
                ) : (
                  <>
                    {data?.map((item) => (
                      <ListItem
                        key={item}
                        disablePadding
                        sx={{ width: "auto" }}
                      >
                        <ListItemButton
                          sx={{ display: "list-item" }}
                          onClick={(e) => {
                            if (Boolean(item.DOCUMENT_URL)) {
                              navigate(item.DOCUMENT_URL);
                              handleClose();
                            }
                          }}
                        >
                          {item?.DOC_NM}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
