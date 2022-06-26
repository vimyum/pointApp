import { useRef, useState, useCallback } from "react";
import CssBaseline from '@mui/material/CssBaseline';

import MyAppBar from "./components/appbar";
import {
  BrowserRouter,
  Routes,
  Route,
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

function App() {
  const [userInfo, setUserInfo] = useState(dummyUser);
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
    </BrowserRouter>
    </ThemeProvider>
    </div>)
}

export default App
