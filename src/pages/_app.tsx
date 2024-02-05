import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { StyledEngineProvider, Box } from "@mui/material";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <StyledEngineProvider injectFirst>
        <Box className="flex min-h-screen w-full">
          <Component {...pageProps} />
        </Box>
      </StyledEngineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
