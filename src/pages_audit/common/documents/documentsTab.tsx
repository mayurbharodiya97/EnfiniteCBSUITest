import { Fragment, useState, FC, useContext, useEffect } from "react";
import { DocumentGridCRUD as DocGrid } from "./documentGridCRUD";
import { DOCCRUDContextProvider, DocAPICrudProviderGenerator } from "./context";
import { useQuery } from "react-query";
import { ClearCacheContext } from "cache";
import { useStyles } from "./style";
import * as API from "./api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Button, Tab, Tabs } from "@mui/material";

const TabPanel = ({ value, index, children }) => {
  return Number(value) === Number(index) ? children : null;
};

export const DocumentGridCRUD: FC<{
  moduleType: string;
  productType?: string;
  refID: string;
  serialNo?: string;
  onClose?: any;
  skipBankDetails?: boolean;
  readOnly?: boolean;
}> = ({
  moduleType,
  productType,
  refID,
  serialNo,
  onClose,
  skipBankDetails = false,
  readOnly,
}) => {
  const { addEntry } = useContext(ClearCacheContext);
  const [currentTab, setCurrentTab] = useState(0);
  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };
  const classes = useStyles();
  useEffect(() => {
    /*eslint-disable  react-hooks/exhaustive-deps*/
    addEntry([
      "getDocumentCRUDTabsMetadata",
      moduleType,
      productType ?? "legal",
      refID,
    ]);
  }, [addEntry, moduleType, refID]);
  const queryResult = useQuery(
    ["getDocumentCRUDTabsMetadata", moduleType, productType ?? "legal", refID],
    () =>
      API.getDocumentCRUDTabsMetadata({
        moduleType,
        productType,
        refID,
      })
  );
  let tabs: any[] = queryResult.data as any;
  if (queryResult.isSuccess) {
    if (!Array.isArray(tabs)) {
      tabs = [];
    } else {
      if (skipBankDetails) {
        tabs = tabs.filter((one) => one.label !== "Bank");
      }
      tabs = tabs.sort((a, b) =>
        a.sequence > b.sequence ? 1 : a.sequence < b.sequence ? -1 : 0
      );
      if (skipBankDetails) {
        tabs = tabs.map((tab, index) => {
          return { ...tab, sequence: index };
        });
      }
    }
  }
  const renderResult = queryResult.isLoading ? (
    <LoaderPaperComponent />
  ) : queryResult.isError ? (
    //@ts-ignore
    queryResult.error?.error_msg ?? "unknown error occured"
  ) : (
    <Fragment>
      <div style={{ display: "flex" }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          variant="scrollable"
        >
          {tabs.map((one) => (
            <Tab label={one.label} id={`${one.sequence}`} key={one.sequence} />
          ))}
        </Tabs>
        {typeof onClose === "function" ? (
          <Fragment>
            <div style={{ flexGrow: 1 }} />
            <Button variant="text" onClick={onClose}>
              Close
            </Button>
          </Fragment>
        ) : null}
      </div>
      <div className={classes.tabPanel}>
        {tabs.map((one) => {
          return (
            <TabPanel
              value={currentTab}
              index={`${one.sequence}`}
              key={one.sequence}
            >
              <DOCCRUDContextProvider
                key={one.docType.filter((one) => one?.primary === true)[0].type}
                {...DocAPICrudProviderGenerator(
                  moduleType,
                  productType,
                  one.docType,
                  refID,
                  serialNo
                )}
              >
                <DocGrid
                  disableActions={
                    readOnly ? ["Add", "Verify", "Delete", "Update"] : []
                  }
                />
              </DOCCRUDContextProvider>
            </TabPanel>
          );
        })}
      </div>
    </Fragment>
  );
  return renderResult;
};
