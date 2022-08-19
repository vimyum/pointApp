import { useRef, useState, useCallback, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Link, useNavigate } from "react-router-dom";

import CardPicture from "../assets/HKCardPicture.jpeg";

import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import ConfirmCard from "../components/ConfirmCard";
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

type  History = {
  name: string
  date: number
}
type Ticket = {
  amount: number
  comment: string
  history: Record<string, History>
  picture: string
}

const ReceiveView: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const navigate = useNavigate();

  const confirm = () => {


    /* update point balance */

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

  const setTicketHandler = (c: string) => {
    const dbRef = ref(getDatabase());
    console.log("c: %o", c)
    get(child(dbRef, `tickets/${c}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setTicketHandler(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const comment = "MTBコース整備活動ボランティアの参加ポイントです";
  return ticket ? (
    <ConfirmCard
      callback={confirm}
      comment={ticket.comment}
      cardPicture={cardPicture}
      point={ticket.amount}
    />
  ) : isManualInput ? (
    <ManualInput setCode={setTicketHandler} setExit={setIsManualInput} />
  ) : (
    <Scan setCode={setTicketHandler} setExit={setIsManualInput} />
  );
};

export default ReceiveView;
