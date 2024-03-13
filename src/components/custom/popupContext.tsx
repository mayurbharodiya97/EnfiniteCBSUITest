import React, { createContext, useContext, useEffect, useState } from "react";
import { PopupRequestWrapper } from "./popupRequest";

type TIcon = "INFO" | "ERROR" | "WARNING" | "SUCCESS";
type TButtonName =
  | "Ok"
  | "Cancel"
  | "Yes"
  | "No"
  | "Close"
  | "Accept"
  | "Decline";

type TMessage = {
  isOpen?: boolean;
  messageTitle: string;
  message: string;
  icon: TIcon;
  buttonNames: TButtonName[];
  callBack?: Function;
};

type TMessageBoxParams = {
  messageTitle: string;
  message: string;
  icon?: TIcon;
  buttonNames?: TButtonName[];
};

type TPopupContextType = {
  // message: TMessage;
  MessageBox: (params: TMessageBoxParams) => Promise<TButtonName> | any;
  CloseMessageBox: () => void;
};

const initialMessage: TMessage = {
  isOpen: false,
  messageTitle: "",
  message: "",
  icon: "INFO",
  buttonNames: ["Ok"],
};

const initialContext: TPopupContextType = {
  // message: initialMessage,
  MessageBox: () => {},
  CloseMessageBox: () => {},
};

export const PopupContext = createContext<TPopupContextType>(initialContext);

export const PopupContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [message, setMessage] = useState<TMessage>(initialMessage);

  const MessageBox = ({
    messageTitle,
    message,
    icon = "INFO",
    buttonNames = ["Ok"],
  }: TMessageBoxParams) => {
    console.log("in popup");
    return new Promise((resolve) => {
      setMessage({
        isOpen: true,
        messageTitle,
        message,
        icon,
        buttonNames,
        callBack: (buttonName: TButtonName) => {
          resolve(buttonName);
          CloseMessageBox();
        },
      });
    });
  };

  const CloseMessageBox = () => {
    setMessage(initialMessage);
  };

  return (
    <PopupContext.Provider value={{ MessageBox, CloseMessageBox }}>
      <>
        {children}
        {message.isOpen ? (
          <PopupRequestWrapper
            open={message.isOpen}
            Message={message.message}
            MessageTitle={message.messageTitle}
            rows={[]}
            onClickButton={message.callBack}
            buttonNames={message.buttonNames}
            icon={message.icon}
          />
        ) : null}
      </>
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  return useContext(PopupContext);
};
