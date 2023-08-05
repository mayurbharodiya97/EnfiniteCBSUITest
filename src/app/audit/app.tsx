import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { SnackbarProvider } from "notistack";
import { queryClient } from "cache";
import "registry/fns/registerFnsNetBanking";
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

const themeObj = unstable_createMuiStrictModeTheme(theme);

export const App = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={themeObj}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
              <IndexPage />
            </SnackbarProvider>
            {/* {process.env.NODE_ENV !== "production" ? (
                <ReactQueryDevtools />
              ) : null} */}
          </QueryClientProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};
