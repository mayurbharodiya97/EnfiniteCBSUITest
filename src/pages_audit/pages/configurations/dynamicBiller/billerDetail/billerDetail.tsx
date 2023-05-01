import {
  useRef,
  FC,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Tab } from "components/styledComponent/tab";
import { Tabs } from "components/styledComponent/tabs";
import { ClearCacheContext } from "cache";
import { GridCRUD, CRUDContextProvider, Transition } from "pages_audit/common";
import * as API from "./api";
import { API as CRUD2API } from "pages_audit/common/crud2";
import { queryClient, ClearCacheProvider } from "cache";
import { useStyles } from "pages_audit/common/tabStyles";
import { AppBar, Dialog, makeStyles, Toolbar } from "@material-ui/core";
import { useDialogStyles } from "components/detailPopupGridData";
import Typography from "@material-ui/core/Typography";
import { GradientButton } from "components/styledComponent/button";
import { useLocation, useNavigate } from "react-router-dom";
import { BillerFields } from "../billerFields";

const TabPanel = ({ value, index, children }) => {
  return Number(value) === Number(index) ? children : null;
};

const bankCrudAPIArgs = (flag, categoryID, subCategoryID, billerID) => ({
  context: {
    flag,
    categoryID,
    subCategoryID,
    billerID,
  },
  insertFormData: {
    fn: API.insertParameterData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  checkFormDataExist: {
    fn: CRUD2API.checkFormDataExist,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  deleteFormData: {
    fn: API.deleteParameterData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  updateFormData: {
    fn: API.updateParameterData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  getFormData: {
    fn: API.getParameterData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  getGridFormData: {
    fn: API.getGridParameterData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  getFormMetaData: {
    fn: API.getFormMetaData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
  getGridFormMetaData: {
    fn: API.getGridFormMetaData,
    args: { flag, categoryID, subCategoryID, billerID },
  },
});

const useTypeStyles = makeStyles((theme) => ({
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

const BillerDetail: FC<{
  closeDialog?: any;
}> = ({ closeDialog }) => {
  const isDataEditedRef = useRef(false);
  const { getEntries } = useContext(ClearCacheContext);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };
  const { state: rows }: any = useLocation();
  const classes = useDialogStyles();
  const tabClasses = useStyles();
  const headerClasses = useTypeStyles();
  //Remove all the cached queries of all tabs when this component unmounts
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getBillerFieldsGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(
    (rowdata) => {
      navigate(".", { state: rowdata });
    },
    [navigate]
  );

  return (
    <Dialog
      open={true}
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
              Biller Details - {rows[0]?.data?.BILLER_NAME ?? ""}
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
            <BillerFields
              billerData={rows[0]?.data}
              rows={rows}
              ClosedEventCall={ClosedEventCall}
            />
          </TabPanel>
          <TabPanel value={currentTab} index="1" key={1}>
            <CRUDContextProvider
              {...bankCrudAPIArgs(
                "infoPara",
                rows[0]?.data.CATEGORY_ID + "",
                rows[0]?.data.SUB_CATEGORY_ID + "",
                rows[0]?.data.BILLER_ID + ""
              )}
            >
              <GridCRUD
                isDataChangedRef={isDataEditedRef}
                disableActions={["Add", "Verify", "Delete", "Update", "View"]}
              />
            </CRUDContextProvider>
          </TabPanel>
          <TabPanel value={currentTab} index="2" key={2}>
            <CRUDContextProvider
              {...bankCrudAPIArgs(
                "payPara",
                rows[0]?.data.CATEGORY_ID + "",
                rows[0]?.data.SUB_CATEGORY_ID + "",
                rows[0]?.data.BILLER_ID + ""
              )}
            >
              <GridCRUD
                isDataChangedRef={isDataEditedRef}
                disableActions={["Add", "Verify", "Delete", "Update", "View"]}
              />
            </CRUDContextProvider>
          </TabPanel>
        </div>
      </div>
    </Dialog>
  );
};

export const BillerDetailWrapper = ({ handleDialogClose }) => (
  <ClearCacheProvider>
    <BillerDetail closeDialog={handleDialogClose} />
  </ClearCacheProvider>
);
