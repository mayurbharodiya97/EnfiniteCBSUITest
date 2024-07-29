import {
    useRef,
    useCallback,
    useEffect,
    useState,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useQuery } from "react-query";
import * as API from "./api";
import { ClearCacheProvider, queryClient } from "cache";
import { strBranchLevelHistoryGridMetaData } from "./girdMetadata";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Dialog } from "@mui/material";


const actions: ActionTypes[] = [
    {
        actionName: "all",
        actionLabel: "All",
        multiple: undefined,
        rowDoubleClick: false,
        alwaysAvailable: true,
    },
    {
        actionName: "extraction",
        actionLabel: "As per Extraction",
        multiple: undefined,
        rowDoubleClick: false,
        alwaysAvailable: true,
    },
    {
        actionName: "suspicious",
        actionLabel: "Suspicious",
        multiple: undefined,
        rowDoubleClick: false,
        alwaysAvailable: true,

    },
    {
        actionName: "white-listed",
        actionLabel: "White Listed",
        multiple: undefined,
        rowDoubleClick: false,
        alwaysAvailable: true,

    },
    {
        actionName: "close",
        actionLabel: "Close",
        multiple: false,
        rowDoubleClick: true,
        alwaysAvailable: true,
    },
];

const StrBranchLevelHistoryGrid = ({ onClose }) => {
    const gridRef = useRef<any>(null);
    const { t } = useTranslation();
    const { state: rows } = useLocation();
    const [girdData, setGridData] = useState<any>([]);
    const [isFlag, setIsFlag] = useState("A");
    const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
        any,
        any
    >(["getStrAcHistoryData"], () =>
        API.getStrAcHistoryData({
            A_COMP_CD: rows?.[0]?.data?.ACCT_COMP_CD,
            A_BRANCH_CD: rows?.[0]?.data?.ACCT_BRANCH_CD,
            A_ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
            A_ACCT_CD: rows?.[0]?.data?.ACCT_CD
        })
    );
    useEffect(() => {
        if (Array.isArray(data) && isFlag === "A") {
            setGridData(data);
        } else {
            setGridData(data?.filter((item) => item.SUSPICIOUS_FLAG === isFlag) || []);
        }
    }, [data, isFlag]);

    useEffect(() => {
        return () => {
            queryClient.removeQueries(["getStrAcHistoryData"]);
        }
    }, []);

    const setCurrentAction = useCallback(async (data) => {
        if (data?.name === "all") {
            setIsFlag("A")
        }
        else if (data?.name === "extraction") {
            setIsFlag("N")
        } else if (data?.name === "suspicious") {
            setIsFlag("Y")
        } else if (data?.name === "white-listed") {
            setIsFlag("B")
        } else if (data?.name === "close") {
            onClose();
        }
    }, []);

    if (strBranchLevelHistoryGridMetaData) {
        strBranchLevelHistoryGridMetaData.gridConfig.gridLabel = "STR History" + "for A/c" + "-" + rows?.[0]?.data?.ACCT_CD_NEW + "" + rows?.[0]?.data?.ACCT_NM
    }
    return (
        <>
            {isError && (
                <Alert
                    severity="error"
                    errorMsg={error?.error_msg ?? "Something went to wrong.."}
                    errorDetail={error?.error_detail}
                    color="error"
                />
            )}
            <GridWrapper
                key={"strBranchLevelHistoryGrid" + girdData + isFlag}
                finalMetaData={strBranchLevelHistoryGridMetaData}
                data={girdData ?? []}
                setData={() => null}
                loading={isLoading || isFetching}
                actions={actions}
                setAction={setCurrentAction}
                ref={gridRef}
                refetchData={() => refetch()}
            />

        </>
    );
};
export const StrAcLevelBranchHistoryGridWrapper = ({ onClose }) => {
    return (
        <Dialog
            open={true}
            PaperProps={{
                style: {
                    width: "90%",
                },
            }}
            maxWidth="lg"
        >
            <ClearCacheProvider>
                <StrBranchLevelHistoryGrid onClose={onClose} />
            </ClearCacheProvider>
        </Dialog>

    );
};
