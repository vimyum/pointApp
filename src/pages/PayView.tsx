import { useRef, useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, child, get, update } from "firebase/database";

import { UserContext } from "../App";

import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import PaymentForm from "../components/PaymentForm";
import Swal from 'sweetalert2'
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

  const handleSetPayee = async (code: string) => {
      const dbRef = ref(getDatabase());
      console.log("payee code: %o", code);
      const snapshot = await get(child(dbRef, `users/${code}`)).catch(
        (error) => {
          console.error(error);
        }
      );

      if (snapshot?.exists()) {
        setPayee({...snapshot.val(), userId: code});
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

  return ( payee ? <PaymentForm callback={()=>{}} userInfo={userInfo} payeeInfo={payee} />:
     (isManualInput ?  <ManualInput setCode={handleSetPayee} setExit={setIsManualInput} pay /> :
      <Scan setCode={handleSetPayee} setExit={setIsManualInput} />));
}

export default PayView;