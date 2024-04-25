import React, { Fragment, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const LienMasterGrid = lazy(()=> import('./lienMaster/lienMasterGrid'))
const AcPeriodMasterGrid = lazy(()=> import('./ACperiodMaster/ACperiodMasterGrid'))
const ModeMasterGrid = lazy(()=> import('./modeMaster/modeMasterGrid'));

const Master = () => {  
  return (  
    <Fragment>
    <Suspense fallback={<h1>Loading.....</h1>}> 
    <Routes>
      <Route path="lien-master/*" element={<LienMasterGrid />} />
      <Route path="a/c-period-master/*" element={<AcPeriodMasterGrid />} />
      <Route path="mode-master/*" element={<ModeMasterGrid />} />
    </Routes>
    </Suspense>
    </Fragment> 
  );
};

export default Master;
