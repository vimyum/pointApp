import React, { useRef, useState, useCallback } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HelpIcon from '@mui/icons-material/Help';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import MyAppBar from "./components/appbar";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { teal, grey } from '@mui/material/colors';

import TopView from "./pages/TopView";
import PayView from "./pages/PayView";
import ReceiveView from "./pages/ReceiveView";
import { UserInfo } from "./schemas/schema";

import './App.css'

const dummyUser: UserInfo = {
  id: "tsagara@gmail.com",
  displayName: "さがら",
  role: "user",
  point: 1989,
}

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
  const [userInfo, setUserInfo] = useState(dummyUser);
  const [value, setValue] = useState(0);

  return (<div>
   <CssBaseline />
   <ThemeProvider theme={myTheme}>
    <MyAppBar />
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<TopView userInfo={userInfo} />} />
                <Route path="/pay" element={<PayView />} />
                <Route path="/receive" element={<ReceiveView />} />
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
          <BottomNavigationAction label="イベント" icon={<EventNoteIcon fontSize="large"/>} />
          <BottomNavigationAction label="ヘルプ" icon={<HelpIcon fontSize="large"/>} />
        </BottomNavigation>
    </BrowserRouter>
    </ThemeProvider>
    </div>)
}

export default App
