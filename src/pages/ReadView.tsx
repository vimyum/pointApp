import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "../schemas/schema";
import { UserContext } from "../App";
import { UserDbInfo } from "../schemas/schema";
import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import TicketCard from "../components/TicketCard";
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import PaymentForm from "../components/PaymentForm";

const ReadView: React.FC = () => {
  const [payee, setPayee] = useState<UserDbInfo | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const userInfo = useContext(UserContext) as UserDbInfo;

  /* チケット選択、OK後の処理 */
  const ticketConfirm = () => {
    if (!ticket) {
      return;
    }
    const newRecord: Record<string, any> = {};
    const ticketHistoryPath = `/tickets/${ticket?.ticketId}/history`;
    newRecord[ticketHistoryPath] = {
      ...ticket.history,
      [userInfo.userId]: {
        name: userInfo.name,
        date: new Date().getTime(),
      },
    };
    const userBalancePath = `/users/${userInfo.userId}/balance`;
    newRecord[userBalancePath] = ticket.amount + userInfo.balance;
    console.log("newRecord: %o", newRecord);
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

  /* 金額入力、OK後の処理 */
  const handleConfirm = async (amount: number) => {
    if (payee == undefined) {
      return;
    }
    const confirmResult = await Swal.fire({
      title: `支払い額：${amount}`,
      text: `支払い先：${payee?.name}`,
      showCancelButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#009688",
      focusConfirm: false,
      allowOutsideClick: false,
    });

    if (confirmResult.isConfirmed) {
      const newRecord: Record<string, any> = {};
      const userBalancePath = `/users/${userInfo.userId}/balance`;
      const payeeBalancePath = `/users/${payee.userId}/balance`;
      newRecord[userBalancePath] = userInfo.balance - amount;
      newRecord[payeeBalancePath] = payee.balance + amount;
      console.log("newRecord: %o", newRecord);
      update(ref(getDatabase()), newRecord);

      await Swal.fire({
        text: `${amount}ポイントを${payee?.name}に支払いました`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#009688",
        focusConfirm: true,
        allowOutsideClick: false,
      });
    }
    navigate("/");
  };

  const codeHandler = async (code: string) => {
    /* コードがユーザIDかチケットID(@から始まる)かを見分ける */
    if (code.match(/^@.+/)) {
      setPayee(null);
      ticketHandler(code);
    } else {
      setTicket(null);
      payeeHandler(code);
    }
  }

  /* コードがユーザーIDだった場合のユーザー情報取得処理 */
  const payeeHandler = async (code: string) => {
    const dbRef = ref(getDatabase());
    console.log("payee code: %o", code);
    const snapshot = await get(child(dbRef, `users/${code}`)).catch((error) => {
      console.error(error);
    });

    if (snapshot?.exists()) {
      setPayee({ ...snapshot.val(), userId: code });
    } else {
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

  /* コードがチケットIDだった場合のチケット情報取得処理 */
  const ticketHandler = async (code: string) => {
    const dbRef = ref(getDatabase());
    console.log("code: %o", code);
    const snapshot = await get(child(dbRef, `tickets/${code}`)).catch(
      (error) => {
        console.error(error);
      }
    );

    if (snapshot?.exists()) {
      const ticketTemp = { ...snapshot.val(), ticketId: code };
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

  if (ticket) {
    return (
      <TicketCard
        callback={ticketConfirm}
        comment={ticket.comment}
        cardPicture={ticket.picture}
        point={ticket.amount}
        used={userInfo.userId in ticket.history}
      />
    );
  }
  if (payee) {
    return (
      <PaymentForm
        callback={handleConfirm}
        userInfo={userInfo}
        payeeInfo={payee}
      />
    );
  }
  if (isManualInput) {
    return (
      <ManualInput setCode={codeHandler} setExit={setIsManualInput} />
    );
  }
  return <Scan setCode={codeHandler} setExit={setIsManualInput} />;
};

export default ReadView;
