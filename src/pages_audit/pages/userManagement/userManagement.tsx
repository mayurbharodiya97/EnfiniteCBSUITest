import { Routes, Route } from "react-router-dom";
import { UserCreationGridWrapper } from "./userCreation";
import { UserGroupGridWrapper } from "./userGroup";
import { UserPushnotifGridWrapper } from "./userPushnotifTempl";
export const UserManagementMenu = () => (
  <Routes>
    {<Route path="user-maintenance/*" element={<UserCreationGridWrapper />} />}
    {<Route path="user-group/*" element={<UserGroupGridWrapper />} />}
    {<Route path="user-push/*" element={<UserPushnotifGridWrapper />} />}
  </Routes>
);
