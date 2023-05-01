import { useRef, useEffect, useContext } from "react";
import { Transition } from "pages_audit/common";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { AppBar, Dialog, Toolbar, Typography } from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { GradientButton } from "components/styledComponent/button";
import { BillerFieldOptionsGridMetaData } from "../../billerFields/fieldOptions/gridMetadata";
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
export const BillerFieldOptionsRefresh = ({
  open,
  closeDialog,
  fieldRowData,
}) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const classes = useDialogStyles();
  const headerClasses = useHeaderStyles();

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBillerFieldOptionsGridData"]);
    };
  }, [getEntries]);
  return (
    <Dialog
      open={open}
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
              Field Options - {fieldRowData?.FIELD_NAME ?? ""}
            </Typography>
            <GradientButton onClick={closeDialog}>Close</GradientButton>
          </Toolbar>
        </AppBar>

        <GridWrapper
          key={`FieldOptionsRefreshGrid`}
          finalMetaData={BillerFieldOptionsGridMetaData as GridMetaDataType}
          data={fieldRowData?.FIELD_OPTIONS ?? []}
          setData={() => null}
          ref={myGridRef}
        />
      </div>
    </Dialog>
  );
};
