import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import { StaticAdminUserReports } from "../reports/staticReports/staticReports";
import JointDetailsForm from "./JointDetails";
import TodayTransactionForm from "./TodayTransaction";
import Root from "./Root";
import Insurance from "./Insurance";
import CheckBook from "./CheckBook";
import HoldCharge from "./HoldCharge";
import Snapshot from "./SnapShot";
import Search from "./Search";
import StopPay from "./StopPay";
import Document from "./Document";
import Subsidy from "./Subsidy";
import Disbursement from "./Disbursement";
import Footer from "./Footer/Footer";
import AccDetails from "./AccountDetails/AccDetails";

// const JointDetails = lazy(() => import("./JointDetails"));
console.log("daily trans");

export const DailyTrans = () => (
  <div style={{ padding: "8px" }}>
    <h1>Daily Transaction (Maker) (TRN/001) </h1>

    <Root />

    <Routes>
      <Route path={"/"} element={<AccDetails />} />
      <Route path={"/acc"} element={<AccDetails />} />
      <Route path={"/joint"} element={<JointDetailsForm />} />
      <Route path={"/todayTrans"} element={<TodayTransactionForm />} />
      <Route path={"/checkBook"} element={<CheckBook />} />
      <Route path={"/snapshot"} element={<Snapshot />} />
      <Route path={"/holdCharge"} element={<HoldCharge />} />
      <Route path={"/disbursement"} element={<Disbursement />} />
      <Route path={"/subsidy"} element={<Subsidy />} />
      <Route path={"/document"} element={<Document />} />
      <Route path={"/stopPay"} element={<StopPay />} />
      <Route path={"/search"} element={<Search />} />
      <Route path={"/insurance"} element={<Insurance />} />
    </Routes>

    <Footer />
  </div>
);
