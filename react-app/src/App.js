import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/organisms/Header";
import Slider from "./components/organisms/Slider";
import Home from "./components/pages/Home";
import AboutPage from "./components/pages/AboutPage";
import Footer from "./components/organisms/Footer";
import Articles from "./components/pages/Articles";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { useState } from "react";
import Logout from "./components/organisms/Logout";
import CreateArticle from "./components/pages/CreateArticle";
import EditArticle from "./components/pages/EditArticle";
import Profile from "./components/pages/Profile";
import Movies from "./components/pages/Movies";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  return (
    <BrowserRouter>
      <div className="container">
        <Header username={username} />
        {/* <Slider /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/*" element={<Movies />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/new" element={<CreateArticle />} />
          <Route path="/articles/edit/:id" element={<EditArticle />} />
          <Route path="/user/register" element={<Register />} />
          <Route
            path="/user/login"
            element={<Login setUsername={setUsername} />}
          />
          <Route
            path="/user/logout"
            element={<Logout setUsername={setUsername} />}
          />
          <Route path="/user/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
