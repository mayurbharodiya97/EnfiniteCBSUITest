import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SnackbarProvider } from "notistack";
import { queryClient } from "cache";
import "registry/fns/registerFnsCbsEnfinity";
// import "components/tableCellComponents";
import IndexPage from "pages_audit";
import { theme } from "./theme";
import "./index.css";
import {
  ThemeProvider,
  StyledEngineProvider,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { WorkerContextProvider } from "pages_audit/pages/reports/context/exportWorkerContext";
import { CustomSnackbarContent } from "components/customNotification/customNotistack";
import { PopupContextProvider } from "components/custom/popupContext";
import { ThemeProviders } from "./ThemeProvider";

const themeObj = unstable_createMuiStrictModeTheme(theme);

declare module "notistack" {
  interface VariantOverrides {
    customSnackbar: true;
  }
}

export const App = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={themeObj}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <PopupContextProvider>
              <WorkerContextProvider>
                <ThemeProviders>
                  <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={5000}
                    Components={{ customSnackbar: CustomSnackbarContent }}
                  >
                    <IndexPage />
                  </SnackbarProvider>
                </ThemeProviders>
              </WorkerContextProvider>
              {/* {process.env.NODE_ENV !== "production" ? (
                <ReactQueryDevtools />
              ) : null} */}
            </PopupContextProvider>
          </QueryClientProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};
