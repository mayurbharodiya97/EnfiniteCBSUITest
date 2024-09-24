import { Notification } from "./notification";

import { AutoRefreshProvider } from "components/utils/autoRefresh";

export const NotificationWrapper = () => {
  return (
    <AutoRefreshProvider>
      <Notification />
    </AutoRefreshProvider>
  );
};
