import { useRef, useEffect, useContext, useState } from "react";
import { Transition } from "pages_audit/common";
import { BillerFieldOptionsGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "./api";
import { AppBar, Dialog, Toolbar, Typography } from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { GradientButton } from "components/styledComponent/button";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
const useHeaderStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {
    // "&:hover": {
    //   backgroundColor: "var(--theme-color2)",
    //   color: "var(--theme-color1)",
    // },
  },
}));
export const BillerFieldOptions = ({ open, closeDialog, fieldRowData }) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const classes = useDialogStyles();
  const headerClasses = useHeaderStyles();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getBillerFieldOptionsGridData"], () =>
    API.getBillerFieldOptionsGridData({
      categoryID: fieldRowData?.[0]?.data?.CATEGORY_ID,
      subCategoryID: fieldRowData?.[0]?.data?.SUB_CATEGORY_ID,
      billerID: fieldRowData?.[0]?.data?.BILLER_ID,
      srcd: fieldRowData?.[0]?.data?.SR_CD,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBillerFieldOptionsGridData"]);
    };
  }, [getEntries]);
  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "55%",
          //minHeight: "60vh",
          //height: "66.5vh",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "9px" }}>
        {isError && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Something went to wrong.."}
            errorDetail={error?.error_detail}
            color="error"
          />
        )}
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Field Options - {fieldRowData?.[0]?.data?.FIELD_NAME ?? ""}
            </Typography>
            <GradientButton onClick={closeDialog}>Close</GradientButton>
          </Toolbar>
        </AppBar>

        <GridWrapper
          key={`FieldOptionsGrid`}
          finalMetaData={BillerFieldOptionsGridMetaData as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          loading={isLoading || isFetching}
          refetchData={() => refetch()}
          ref={myGridRef}
        />
      </div>
    </Dialog>
  );
};
