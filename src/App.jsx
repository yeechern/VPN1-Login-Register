import { HashRouter as Router, Route, Routes } from "react-router-dom"
import NavDrawer from "./components/NavBar";
import { AuthProvider } from "./components/AuthContext";


//pages
import SubPage from "./pages/PageSub";
import PageProfile from "./pages/PageProfile";
import PageTermService from "./pages/PageTermService";
import PagePrivacy from "./pages/PagePrivacy";
import PageFAQ from "./pages/PageFAQ";
import PageSetting from "./pages/PageSetting";
import PageLogin from "./pages/PageLogin"
import PageHome from "./pages/PageHome"
import PageDevice from "./pages/PageDEvice";

function App() {

  const createRoute = (path, Component) => (
    <Route
      path={path}
      element={
        <NavDrawer>
          <Component />
        </NavDrawer>
      }
    />
  )

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageLogin />} />
          <Route path="/login" element={<PageLogin />} />
          {createRoute("/home", PageHome)}
          {createRoute("/profile", PageProfile)}
          {createRoute("/subscription", SubPage)}
          {createRoute("/setting", PageSetting)}
          {createRoute("/term-service", PageTermService)}
          {createRoute("/privacy-policy", PagePrivacy)}
          {createRoute("/faq", PageFAQ)}
          {createRoute("/devices", PageDevice)}
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App;
