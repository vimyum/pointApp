import { useRef, useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, child, get, update } from "firebase/database";

import { UserContext } from "../App";

import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import PaymentForm from "../components/PaymentForm";
import Swal from "sweetalert2";
import { UserDbInfo } from "../schemas/schema";
import { getAdditionalUserInfo } from "firebase/auth";

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

const PayView: React.FC = () => {
  const [payee, setPayee] = useState<UserDbInfo | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const userInfo = useContext(UserContext) as UserDbInfo;

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

  const handleSetPayee = async (code: string) => {
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

  return payee ? (
    <PaymentForm
      callback={handleConfirm}
      userInfo={userInfo}
      payeeInfo={payee}
    />
  ) : isManualInput ? (
    <ManualInput setCode={handleSetPayee} setExit={setIsManualInput} pay />
  ) : (
    <Scan setCode={handleSetPayee} setExit={setIsManualInput} />
  );
};

export default PayView;
