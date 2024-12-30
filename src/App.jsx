import { HashRouter as Router, Route, Routes } from "react-router-dom"
import PageLogin from "./pages/loginPage"
import PageHome from "./pages/homePage"
import { AuthProvider } from "./components/AuthContext";
import PageProfile from "./pages/profilePage";
import NavDrawer from "./components/NavBar";
import SubPage from "./pages/SubPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageLogin />} />
          <Route path="/login" element={<PageLogin/>}/>

          <Route 
            path="/home" 
            element={
              <NavDrawer>
                <PageHome />
              </NavDrawer>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <NavDrawer>
                <PageProfile />
              </NavDrawer>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <NavDrawer>
                <SubPage />
              </NavDrawer>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App;
