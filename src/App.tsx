import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Result from "./pages/Result";
import ActiveLink from "./components/ActiveLink";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="battle" element={<Battle />} />
        <Route path="result" element={<Result />} />
        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

function Layout() {
  return (
    <>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="container mx-auto sticky">
        <ul className="flex gap-3 leading-9">
          <li>
            <ActiveLink to="/">Popular</ActiveLink>
          </li>
          <li>
            <ActiveLink to="/battle">Battle</ActiveLink>
          </li>
        </ul>
      </nav>

      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
