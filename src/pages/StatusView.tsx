import React, { useRef, useState, useEffect, createContext } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardHeader } from "@mui/material";
import { Histories } from "../schemas/schema";

import { getDatabase, ref, onValue, get, child } from "firebase/database";

const EntranceTicketId = "001";
const ExitTicketId = "099";

const stayingList = (histories: {
  enteredHistory: Histories;
  exitedHistory: Histories;
}) => {
  const staying = calculateStaying(histories);

  return staying.map((user) => {
    const date = new Date(user.date);
    const dateStr = `${date.getHours()}時${date.getMinutes()}分`;
    return (
      <li>
        {dateStr}: {user.name}
      </li>
    );
  });
};

const exitedList = (exitedHistory: Histories) => {
  return Object.keys(exitedHistory).map((userId) => {
    const user = exitedHistory[userId];
    const date = new Date(user.date);
    const dateStr = `${date.getHours()}時${date.getMinutes()}分`;
    return (
      <li>
        {dateStr}: {user.name}
      </li>
    );
  });
};

const calculateStaying = (histories: {
  enteredHistory: Histories;
  exitedHistory: Histories;
}) => {
  const { enteredHistory, exitedHistory } = histories;
  const enteredUserId = Object.keys(enteredHistory);
  const exitedUserId = Object.keys(exitedHistory);
  const stayingUserId = enteredUserId.filter((userId) => {
    return !exitedUserId.includes(userId);
  });

  return stayingUserId.map((userId: string) => {
    const user = enteredHistory[userId];
    return {
      ...user,
      userId: userId,
    };
  });
};

const StatusView: React.FC = () => {
  const [entered, setEntered] = useState<Histories>({});
  const [exited, setExited] = useState<Histories>({});

  useEffect(() => {
    const enteredRef = ref(
      getDatabase(),
      `tickets/${EntranceTicketId}/history`
    );
    const exitedRef = ref(getDatabase(), `tickets/${ExitTicketId}/history`);
    onValue(enteredRef, (snapshot) => {
      setEntered(snapshot.val());
    });
    onValue(exitedRef, (snapshot) => {
      setExited(snapshot.val());
    });
  }, []);

  return (
    <div>
      <Container maxWidth="xs" sx={{ mt: 5, mb: 1, fontSize: "small" }}>
        <Typography
          component="h5"
          variant="h5"
          sx={{ textAlign: "center", my: 3 }}
        >
          現在の滞在状況
        </Typography>
        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              滞在中
        </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              <ul>
                {stayingList({
                  enteredHistory: entered,
                  exitedHistory: exited,
                })}
              </ul>
            </Typography>
          </CardContent>
        </Card>

         <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              帰宅済
        </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              <ul>
                {exitedList(exited)}
              </ul>
            </Typography>
          </CardContent>
        </Card>
     

      </Container>
    </div>
  );
};

export default StatusView;
