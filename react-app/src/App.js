import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Slider from "./components/Slider";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import Footer from "./components/Footer";
import Articles from "./components/Articles";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Slider />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/articles" element={<Articles />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
