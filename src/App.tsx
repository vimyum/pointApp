import React, { useRef, useState, useEffect, createContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HelpIcon from "@mui/icons-material/Help";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import HikingIcon from '@mui/icons-material/Hiking';

import MyAppBar from "./components/appbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { teal, grey } from "@mui/material/colors";

import { UserDbInfo } from "./schemas/schema";
import TopView from "./pages/TopView";
import PayView from "./pages/PayView";
import ReceiveView from "./pages/ReceiveView";
import HelpView from "./pages/HelpView";
import MenuView from "./pages/MenuView";
import ScheduleView from "./pages/ScheduleView";

import "./App.css";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";

import firebaseConfig from "./config/firebaseConfig";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
export const auth = getAuth(app);
export const UserContext = createContext<UserDbInfo | null>(null);

const myTheme = createTheme({
  palette: {
    mode: "light",
    primary: teal,
    divider: teal[200],
    text: {
      primary: grey[900],
      secondary: grey[800],
    },
  },
});

const navButtonSx = {
  fontSize: "1.2",
};

function App() {
  const [userInfo, setUserInfo] = useState<UserDbInfo | null>(null);
  const [value, setValue] = useState(0);
  // const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUserInfo(null);
        return;
      }
      readUserData(currentUser.uid);
    });
  }, []);

  const readUserData = async (userId: string): Promise<void> => {
    const db = getDatabase(app);
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUserInfo({...snapshot.val(), userId});
    });
  };

  const writeUserData = (userDbInfo: UserDbInfo): void => {
    const db = getDatabase(app);
    const { userId, name, email, role, balance } = userDbInfo;
    set(ref(db, "users/" + userId), {
      name: name,
      email: email,
      role: role,
      balance: balance,
    });
  };

  console.log("UserInfo: %o", userInfo);
  if (userInfo == null) {
    return <MenuView writeUserData={writeUserData} />;
  }

  const handleSignOut = () => {
    console.log("handleSignOut is called.");
    signOut(auth);
  };

  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={myTheme}>
        <UserContext.Provider value={userInfo}>
        <MyAppBar handleSignOut={handleSignOut} />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<TopView userInfo={userInfo as UserDbInfo} />}
            />
            <Route path="/pay" element={<PayView />} />
            <Route path="/receive" element={<ReceiveView />} />
            <Route path="/help" element={<HelpView />} />
            <Route path="/schedule" element={<ScheduleView />} />
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
            <BottomNavigationAction
              label="ポイント"
              icon={<QrCode2Icon fontSize="large" />}
              component={Link}
              to="/"
            />
            <BottomNavigationAction
              label="イベント"
              icon={<EventNoteIcon fontSize="large" />}
              component={Link}
              to="/schedule"
            />
            <BottomNavigationAction
              label="入山状況"
              icon={<HikingIcon fontSize="large" />}
              component={Link}
              to="/status"
            />
            <BottomNavigationAction
              label="規約"
              icon={<HelpIcon fontSize="large" />}
              component={Link}
              to="/help"
            />
          </BottomNavigation>
        </BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
