import React, { Fragment, lazy } from "react";
import { Route, Routes } from "react-router-dom";


const Prioritymain = lazy(() => import('./priorityMasterMain/priorityMasterMainGrid'));
const Prioritymastersub = lazy(()=> import('./priorityMasterSub/priorityMasterSubGrid'))
const TradeMaster = lazy(()=> import('./tradeMaster/tradeMasterGrid'))
const AreaMaster = lazy(()=> import('./areaMaster/areaMasterGrid'))

const Master = () => {
  return (
    <Fragment>
    <Routes>
      <Route path="priority-master-main/*" element={<Prioritymain />} />
      <Route path="priority-master-sub/*" element={<Prioritymastersub />} />
      <Route path="trade-master/*" element={<TradeMaster />} />
      <Route path="area-master/*" element={<AreaMaster />} />
    </Routes>
    </Fragment>
  );
};

export default Master;
