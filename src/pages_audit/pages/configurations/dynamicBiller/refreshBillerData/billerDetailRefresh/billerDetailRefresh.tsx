import { useRef, FC, useContext, useState, useCallback, Fragment } from "react";
import { Tab } from "components/styledComponent/tab";
import { Tabs } from "components/styledComponent/tabs";
import { ClearCacheContext } from "cache";
import { Transition } from "pages_audit/common";
import { useStyles } from "pages_audit/common/tabStyles";
import { useDialogStyles } from "components/detailPopupGridData";
import Typography from "@mui/material/Typography";
import { GradientButton } from "components/styledComponent/button";
import { useLocation, useNavigate } from "react-router-dom";
import GridWrapper from "components/dataTableStatic";
import { BillerFieldsGridMetaData } from "../../billerFields/gridMetadata";
import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { BillerParametersGridMetaData } from "../../billerDetail/parameterGridMetadata";
import { BillerFieldOptionsRefresh } from "./fieldOptionsRefresh";
import { makeStyles } from "@mui/styles";
import { AppBar, Dialog, Toolbar, createTheme } from "@mui/material";

const TabPanel = ({ value, index, children }) => {
  return Number(value) === Number(index) ? children : null;
};
// const theme = createTheme();

const useTypeStyles = makeStyles((theme: any) => ({
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

const actions: ActionTypes[] = [
  {
    actionName: "options",
    actionLabel: "Options",
    multiple: false,
    rowDoubleClick: true,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.data?.OPTIONS === "N") {
          return true;
        }
      }
      return false;
    },
  },
];

const BillerDetailRefresh: FC<{
  open: boolean;
  closeDialog?: any;
  billerData?: any;
}> = ({ open, closeDialog, billerData }) => {
  const myFieldGridRef = useRef<any>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState({});
  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };
  const classes = useDialogStyles();
  const tabClasses = useStyles();
  const headerClasses = useTypeStyles();

  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "options") {
        setIsOpenOptions(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  return (
    <Dialog
      open={open}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          minHeight: "80vh",
          height: "100vh",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
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
              Biller Details - {billerData?.BILLER_NAME ?? ""}
            </Typography>
            <GradientButton onClick={closeDialog}>Close</GradientButton>
          </Toolbar>
        </AppBar>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          <Tab label="Biller Fields" id="0" />
          <Tab label="Bill Info Parameters" id="1" />
          <Tab label="Bill Payment Parameters" id="2" />
        </Tabs>
        <div className={tabClasses.tabPanel}>
          <TabPanel value={currentTab} index="0" key={0}>
            <Fragment>
              <GridWrapper
                key={`BillerFieldsRefreshGrid`}
                finalMetaData={BillerFieldsGridMetaData as GridMetaDataType}
                data={billerData?.FIELDS ?? []}
                setData={() => null}
                actions={actions}
                setAction={setCurrentAction}
                ref={myFieldGridRef}
              />
              {isOpenOptions && rowData?.[0]?.data?.FIELD_OPTIONS.length > 0 ? (
                <BillerFieldOptionsRefresh
                  open={isOpenOptions}
                  closeDialog={() => {
                    setIsOpenOptions(false);
                    // ClosedEventCall(rowDataParent);
                  }}
                  fieldRowData={rowData?.[0]?.data}
                />
              ) : null}
            </Fragment>
          </TabPanel>
          <TabPanel value={currentTab} index="1" key={1}>
            <Fragment>
              <GridWrapper
                key={`BillerInfoRefreshGrid`}
                finalMetaData={BillerParametersGridMetaData as GridMetaDataType}
                data={billerData?.INFO_PARA ?? []}
                setData={() => null}
                ref={myFieldGridRef}
              />
            </Fragment>
          </TabPanel>
          <TabPanel value={currentTab} index="2" key={2}>
            <Fragment>
              <GridWrapper
                key={`BillerPayRefreshGrid`}
                finalMetaData={BillerParametersGridMetaData as GridMetaDataType}
                data={billerData?.PAYMENT_PARA ?? []}
                setData={() => null}
                ref={myFieldGridRef}
              />
            </Fragment>
          </TabPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default BillerDetailRefresh;
