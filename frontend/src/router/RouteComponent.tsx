// ** external packages **
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// ** components **
import DashBoardLayout from 'pages/Dashboard/components/DashboardLayout';
import RequiresAuth from 'pages/auth/components/RequiresAuth';
import RequiresUnAuth from 'pages/auth/components/RequiresUnAuth';
import NotFound from 'pages/NotFound';
import PageLoader from 'components/loader/PageLoader';
import SiteLoader from 'components/loader/SiteLoader';

// ** others **
import {
  publicRoutes,
  generalRoutes,
  privateRoutes,
} from 'router/routes/crm.routes';
import {
  ModuleNames,
  BasicPermissionTypes,
} from 'constant/permissions.constant';

export interface RouteAttribute {
  path: string;
  component: JSX.Element;
  name?: string;
  module?: ModuleNames;
  type?: BasicPermissionTypes;
}

const RouteComponent = () => {
  return (
    <Routes>
      {generalRoutes &&
        generalRoutes.length > 0 &&
        generalRoutes.map((route: RouteAttribute, idx: number) => {
          return route.component ? (
            <Route
              key={idx}
              path={route.path}
              element={
                <Suspense fallback={<SiteLoader />}>{route.component}</Suspense>
              }
            />
          ) : null;
        })}

      {publicRoutes &&
        publicRoutes.length > 0 &&
        publicRoutes.map((route: RouteAttribute, idx: number) => {
          return route.component ? (
            <Route
              key={idx}
              path={route.path}
              element={
                <RequiresUnAuth>
                  <Suspense fallback={<SiteLoader />}>
                    {route.component}
                  </Suspense>
                </RequiresUnAuth>
              }
            />
          ) : null;
        })}

      {privateRoutes &&
        privateRoutes.length > 0 &&
        privateRoutes.map((route: RouteAttribute, idx: number) => {
          return route.component ? (
            <Route
              key={idx}
              path={route.path}
              element={
                <RequiresAuth module={route.module} type={route.type}>
                  <DashBoardLayout
                    headerTitle={route.name || 'Welcome Brooks!'}
                  >
                    <Suspense fallback={<PageLoader />}>
                      {route.component}
                    </Suspense>
                  </DashBoardLayout>
                </RequiresAuth>
              }
            />
          ) : null;
        })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteComponent;
