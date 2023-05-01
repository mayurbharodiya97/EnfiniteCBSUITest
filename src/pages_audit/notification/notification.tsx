import { Fragment, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Popover from "@material-ui/core/Popover";
import { useQuery } from "react-query";
import { NotificationItems } from "./notificationItems";
import { useStyles } from "./style";
import * as API from "./api";
import { useAutoRefresh } from "components/utils/autoRefresh";

export const Notification = () => {
  const classes = useStyles();
  const [showNotification, setShowNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const result = useQuery<any, any, any, any>(
    ["getNotificationList"],
    API.getNotificationList,
    {
      onSuccess: (data) => {
        const countfiltered = data.filter(
          (element) => element.readFlag === "No"
        );
        setNotificationCount(countfiltered.length);
      },
    }
  );

  const { resume, pause } = useAutoRefresh(
    () => result.refetch(),
    //@ts-ignore
    Number.parseInt(process.env.REACT_APP_NOTIFICATION_INTERVAL_IN_SECONDS)
  );
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    return () => {
      pause();
    };
  }, []);

  const handleOpenNotification = (event) => {
    setShowNotification(event.currentTarget);
    pause();
  };

  const handleCloseNotification = () => {
    setShowNotification(null);
    result.refetch();
    resume();
  };

  const setNotificationAsRead = () => {
    setNotificationCount((old) => {
      if (old === 0) {
        return old;
      } else {
        return old - 1;
      }
    });
  };

  const setNotificationsAsUnRead = () => {
    setNotificationCount((old) => {
      return old + 1;
    });
  };

  return (
    <Fragment>
      <IconButton onClick={handleOpenNotification}>
        <Badge
          className={notificationCount > 0 ? classes.badge : ""}
          badgeContent={notificationCount}
          color="primary"
        >
          <NotificationsIcon className={classes.notificationIcon} />
        </Badge>
      </IconButton>

      {Array.isArray(result?.data) && result?.data?.length > 0 ? (
        <Popover
          anchorEl={showNotification}
          open={Boolean(showNotification)}
          onClose={handleCloseNotification}
          elevation={3}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              width: "25%",
            },
          }}
        >
          <div
            style={{
              maxHeight: "500px",
            }}
          >
            <List
              style={{
                padding: 0,
              }}
            >
              {result.isSuccess
                ? result?.data?.map((one) => {
                    return (
                      <NotificationItems
                        key={one.activityID}
                        readFlag={one.readFlag}
                        description={one.description}
                        flag={one.flag}
                        activityDate={one.activityDate}
                        activityID={one.activityID}
                        setNotificationAsRead={setNotificationAsRead}
                        setNotificationAsUnRead={setNotificationsAsUnRead}
                      />
                    );
                  })
                : null}
            </List>
          </div>
        </Popover>
      ) : null}
    </Fragment>
  );
};
