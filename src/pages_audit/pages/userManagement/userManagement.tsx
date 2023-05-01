import { Routes, Route } from "react-router-dom";
import { UserCreationGridWrapper } from "./userCreation";
export const UserManagementMenu = () => (
  <Routes>
    {<Route path="user-maintenance/*" element={<UserCreationGridWrapper />} />}
  </Routes>
);
