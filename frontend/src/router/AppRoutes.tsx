import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "@/home/pages/Home";
// import { Home } from "@/pages/home";
import { NotFound } from "@/NotFound/pages/NotFound";

const routes = [
  { path: '/', Page: Home },
  { path: '/*', Page: NotFound }
];

function Routing() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
}

export { Routing };
