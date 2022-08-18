import React, { useRef, useState, useCallback, useEffect } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HelpIcon from '@mui/icons-material/Help';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import MyAppBar from "./components/appbar";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { teal, grey } from '@mui/material/colors';

import TopView from "./pages/TopView";
import PayView from "./pages/PayView";
import ReceiveView from "./pages/ReceiveView";
import HelpView from "./pages/HelpView";
import MenuView from "./pages/MenuView";
import { UserInfo } from "./schemas/schema";

import './App.css'

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth'
import { HandymanOutlined } from "@mui/icons-material";

import firebaseConfig from "./config/firebaseConfig"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const myTheme = createTheme({
  palette: {
    mode: 'light',
     primary: teal,
     divider: teal[200],
     text: {
       primary: grey[900],
       secondary: grey[800],
     },
 }
});

const navButtonSx = {
  fontSize: "1.2"
}

function App() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [value, setValue] = useState(0);
  // const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        return
      }
      setUserInfo(currentUser);
    });
  }, []);

  console.log("UserInfo: %o", userInfo)
  if (userInfo == null) {
    return <MenuView />
  }

  const handleSignOut = () => {
    console.log("handleSignOut is called.")
    signOut(auth);
  }

  return (<div>
   <CssBaseline />
   <ThemeProvider theme={myTheme}>
    <MyAppBar handleSignOut={handleSignOut} />
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<TopView userInfo={userInfo as User} />} />
                <Route path="/pay" element={<PayView />} />
                <Route path="/receive" element={<ReceiveView />} />
                <Route path="/help" element={<HelpView />} />
            </Routes>
    <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
        >
          <BottomNavigationAction label="ポイント" icon={<QrCode2Icon fontSize="large"/>} component={Link} to="/" />
          <BottomNavigationAction label="イベント" icon={<EventNoteIcon fontSize="large"/>} component={Link} to="/register" />
          <BottomNavigationAction label="規約" icon={<HelpIcon fontSize="large"/>}  component={Link} to="/help" />
        </BottomNavigation>
    </BrowserRouter>
    </ThemeProvider>
    </div>)
}

export default App
