import {
  WorkerContextProvider,
  PopupContextProvider,
  SnackbarProviderWrapper,
  queryClient,
} from "@acuteinfo/common-base";

import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import "registry/fns/registerFnsCbsEnfinity";
import IndexPage from "pages_audit";
import { theme } from "./theme";
import "./index.css";
import {
  ThemeProvider,
  StyledEngineProvider,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CustomSnackbarContent } from "components/customNotification/customNotistack";
import { ThemeProviders } from "./ThemeProvider";

const themeObj = unstable_createMuiStrictModeTheme(theme);

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
                  <SnackbarProviderWrapper
                    maxSnack={3}
                    autoHideDuration={5000}
                    Components={{ exportReportSnackbar: CustomSnackbarContent }}
                  >
                    <IndexPage />
                  </SnackbarProviderWrapper>
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
