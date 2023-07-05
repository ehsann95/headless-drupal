import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Slider from "./components/Slider";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import Footer from "./components/Footer";
import Articles from "./components/Articles";
import Register from "./components/Register";
import Login from "./components/Login";
import { useState } from "react";
import Logout from "./components/Logout";
import CreateArticle from "./components/CreateArticle";
import EditArticle from "./components/EditArticle";
import Profile from "./components/Profile";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  return (
    <BrowserRouter>
      <div className="container">
        <Header username={username} />
        <Slider />

        <Routes>
          <Route path="/" element={<Home />} />
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
