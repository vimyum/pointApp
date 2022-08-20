import { useRef, useState, useCallback } from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoginView from "./LoginView";
import RegisterView from "./RegisterView";

import { UserDbInfo } from "../schemas/schema";

const buttonSx = {
  width: "80%",
  fontSize: "1.2em",
  mt: 3,
};

type LoginType = null | "login" | "register";

const MenuView: React.FC<{
  writeUserData: (userDbInfo: UserDbInfo) => void;
}> = (props) => {
  const { writeUserData } = props;

  const [type, setType] = useState<LoginType>(null);
  const handleCancel = () => {
    setType(null);
  };

  if (!type) {
    return (
      <div>
        <Container maxWidth="xs" sx={{ mt: 5, mb: 1 }}>
          <Box sx={{ textAlign: "center", px: 5, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={buttonSx}
              onClick={() => setType("login")}
            >
              ログイン
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={buttonSx}
              onClick={() => setType("register")}
            >
              新規登録
            </Button>
          </Box>
        </Container>
      </div>
    );
  }

  return type == "login" ? (
    <LoginView handleCancel={handleCancel} />
  ) : (
    <RegisterView handleCancel={handleCancel} writeUserData={writeUserData} />
  );
};

export default MenuView;
