import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/NavBar/NavBar";
import Account from "./components/Account/Account";
import Home from "./components/HomePage/Home";
import TopCoins from "./components/TopCoins/TopCoins";
import CoinInfo from "./components/TopCoins/CoinInfo";
import MarketNews from "./components/News/MarketNews";
import CryptoNews from "./components/News/CryptoNews";
import NotFound from "./components/NotFound";
import Login from "./components/Account/Login";
import SignUp from "./components/Account/SignUp";
import ChangePassword from "./components/Account/ChangePassword";
import PrivateRoute from "./components/Account/PrivateRoute";
import { AuthProvider } from './firebase/Auth';

function App() {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/top-coins" element={<TopCoins />} />
            <Route path="/coin/:id" element={<CoinInfo />} />
            <Route path="/market-news" element={<MarketNews />} />
            <Route path="/crypto-news" element={<CryptoNews />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route exact path='/account' element={<PrivateRoute />}>
              <Route exact path='/account' element={<Account />} />
            </Route>
            <Route exact path='/changepassword' element={<PrivateRoute />}>
              <Route exact path='/changepassword' element={<ChangePassword />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
