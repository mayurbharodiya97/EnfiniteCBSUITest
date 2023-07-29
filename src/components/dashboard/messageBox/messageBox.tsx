import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { useQuery, useMutation } from "react-query";
import * as API from "../api";
import { queryClient } from "cache";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { ListPopupMessageWrapper } from "./listPopupBox/listPopupBox";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";

import StickyNotes from "./stickyNotes/stickyNotes";
import { GradientButton } from "components/styledComponent/button";
import { TipsWrapper } from "./tipsBox/tipsBoxWrapper";

interface updateAUTHDetailDataType {
  userID: any;
  COMP_CD: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateMasterData) =>
  async ({ userID, COMP_CD }: updateAUTHDetailDataType) => {
    return updateMasterData({ userID, COMP_CD });
  };
export const MessageBox = ({ screenFlag = "" }: any) => {
  const [toggle, setToggle] = useState(false);
  const { authState } = useContext<any>(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState(false);

  const { t } = useTranslation();
  const refData = useRef<any>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    [
      "getDashboardMessageBoxData",
      {
        screenFlag,
        userID: authState?.user?.id ?? "",
        // transactionID,
      },
    ],
    () =>
      API.getDashboardMessageBoxData({
        screenFlag,
        userID: authState?.user?.id ?? "",
      })
  );

  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.getNoteCountData),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {},
    }
  );

  useEffect(() => {
    const mutationArguments: any = {
      userID: authState?.user?.id ?? "",
      COMP_CD: authState?.companyID ?? "",
    };
    mutation.mutate(mutationArguments);
  }, []);

  const dataLength = data ? data.length : 0;
  const dataNoteLength = mutation.data?.[0]?.CNT;

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getDashboardMessageBoxData",
        {
          screenFlag,
          userID: authState?.user?.id ?? "",
          // transactionID: data?.transactionID,
        },
      ]);
      queryClient.removeQueries(["getNoteCountData"]);
    };
  }, []);

  const handleClick = () => {
    if (screenFlag === "Notes") {
      setIsOpenSave(true);
      // return;
    } else {
      setToggle(!toggle);
    }
  };
  const handleDialogClose = () => {
    setIsOpenSave(false);
  };
  const handleLabelClick = (item) => {
    refData.current = item;
    if (screenFlag === "Notes") {
      setIsOpenSave(false);
    } else {
      setIsOpenSave(true);
    }
  };

  return (
    <>
      <Grid>
        <Box
          sx={{
            height: "70px",
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
            marginBottom: "9px",
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
              {`${t(screenFlag)}`}
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
                ? t("AnnouncingNewFeatures")
                : screenFlag === "Tips"
                ? t("BePreaparedForFruad")
                : screenFlag === "Notes"
                ? t("CustomerQueriesSolve")
                : screenFlag === "Alert"
                ? t("LowBalanceAlert")
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
                ? dataLength
                : screenFlag === "Tips"
                ? dataLength
                : screenFlag === "Notes"
                ? dataNoteLength
                : screenFlag === "Alert"
                ? dataLength
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
                <>
                  {/* <EventNoteOutlinedIcon
                    style={{ color: " #5290F5", fontSize: "30px" }}
                  /> */}
                  <AddIcon
                    style={{ color: " #5290F5", fontSize: "30px" }}
                    // onClick={(e) => {
                    //   setIsOpenSave(true);
                    //   // setToggle(!toggle);
                    // }}
                  />

                  {/* <ReactStickyNotes onChange={handleOnChange} /> */}
                </>
              ) : screenFlag === "Alert" ? (
                <WarningAmberRoundedIcon
                  style={{ color: " #FF4F79", fontSize: "30px" }}
                />
              ) : null}
            </IconButton>
            {/* {screenFlag === "Notes" ? (
              <Box
                sx={{
                  height: "38px",
                  width: "38px",
                  backgroundColor: "var(--theme-color3)",
                  color: "var(--theme-color2)",
                  borderRadius: "12px",
                  padding: "4px",
                  margin: "4px 0 0 4px",
                }}
              >
                <AddIcon
                  // style={{ fontSize: "30px" }}
                  onClick={(e) => {
                    setIsOpenSave(true);
                  }}
                />
              </Box>
            ) : null} */}
          </Grid>
        </Box>
      </Grid>
      {toggle ? (
        <>
          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : (
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
                    {data.map((item, _index) => (
                      <ListItemData
                        key={"listItemforannounce" + _index}
                        name={item?.DESCRIPTION}
                        disabled={false}
                        onClick={() => {
                          handleLabelClick(item);
                        }}
                        selected={undefined}
                      />
                    ))}
                  </List>
                </nav>
              </Box>
            </Grid>
          )}
        </>
      ) : null}
      {screenFlag === "Announcement" ? (
        <>
          {isOpenSave ? (
            <ListPopupMessageWrapper
              closeDialog={handleDialogClose}
              dialogLabel={refData.current?.DESCRIPTION}
              transactionID={refData.current?.TRAN_CD}
              open={undefined}
              formView={"view"}
            />
          ) : null}
        </>
      ) : screenFlag === "Notes" ? (
        <>
          {isOpenSave ? (
            <StickyNotes open={isOpenSave} closeDialog={handleDialogClose} />
          ) : null}
        </>
      ) : screenFlag === "Tips" ? (
        <>
          {isOpenSave ? (
            <TipsWrapper
              open={isOpenSave}
              closeDialog={handleDialogClose}
              dialogLabel={refData.current?.DESCRIPTION}
              transactionID={undefined}
            />
          ) : null}
        </>
      ) : null}
      {/* {isOpenSave && (
        <StickyNotes
          closeDialog={handleDialogClose}
          dialogLabel={data}
          open={isOpenSave}
        />
      )} */}
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
