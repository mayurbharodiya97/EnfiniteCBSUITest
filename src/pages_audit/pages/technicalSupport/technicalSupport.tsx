import { Routes, Route } from "react-router-dom";
import { ReleaseUsersGridWrapper } from "./releaseUser";
import { ReleaseCardUsersGridWrapper } from "./releaseUser/releaseUserGrid/releaseCardUserGrid";
export const TechnicalSupport = () => (
  <Routes>
    <Route path="release-block-users/*" element={<ReleaseUsersGridWrapper />} />
    <Route
      path="release-card-block-users/*"
      element={<ReleaseCardUsersGridWrapper />}
    />
  </Routes>
);
