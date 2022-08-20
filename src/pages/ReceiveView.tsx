import { useRef, useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Link, useNavigate } from "react-router-dom";

import { Ticket } from "../schemas/schema";
import { UserContext } from "../App";
import { UserDbInfo } from "../schemas/schema";
import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import ConfirmCard from "../components/TicketCard";
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

const ReceiveView: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const userInfo = useContext(UserContext) as UserDbInfo;

  const confirm = () => {

    /* update ticket history */
    if (!ticket) {
      return;
    }
    const newRecord : Record<string, any> = {}
    const ticketHistoryPath = `/tickets/${ticket?.ticketId}/history`;
    newRecord[ticketHistoryPath] = { 
      ...ticket.history,
      [userInfo.userId] : {
        name: userInfo.name,
        date: new Date().getTime(),
      }
    };
    const userBalancePath = `/users/${userInfo.userId}/balance`;
    newRecord[userBalancePath] = ticket.amount + userInfo.balance;
    console.log("newRecord: %o", newRecord)
    update(ref(getDatabase()), newRecord);

    Swal.fire({
      text: "ポイントが付与されました",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#009688",
      focusConfirm: false,
      allowOutsideClick: false,
    }).then(() => {
      navigate("/");
    });
  };

  const setTicketHandler = async (code: string) => {
    const dbRef = ref(getDatabase());
    console.log("code: %o", code);
    const snapshot = await get(child(dbRef, `tickets/${code}`)).catch(
      (error) => {
        console.error(error);
      }
    );

    if (snapshot?.exists()) {
      const ticketTemp = {...snapshot.val(), ticketId: code}
      if (!ticketTemp.history) {
        ticketTemp.history = {};
      }
      setTicket(ticketTemp);
    } else {
      console.log("No data available");
      Swal.fire({
        text: "コードが正しくありません",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#009688",
        focusConfirm: false,
        allowOutsideClick: false,
      }).then(() => {
        navigate("/");
      });
    }
  };

  return ticket ? (
    <ConfirmCard
      callback={confirm}
      comment={ticket.comment}
      cardPicture={ticket.picture}
      point={ticket.amount}
      used={userInfo.userId in ticket.history}
    />
  ) : isManualInput ? (
    <ManualInput setCode={setTicketHandler} setExit={setIsManualInput} />
  ) : (
    <Scan setCode={setTicketHandler} setExit={setIsManualInput} />
  );
};

export default ReceiveView;
