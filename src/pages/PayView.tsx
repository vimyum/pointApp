import { useRef, useState, useCallback, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Link, useNavigate } from "react-router-dom";

import CardPicture from '../assets/HKCardPicture.jpeg';

import Scan from "../components/Scan";
import ManualInput from "../components/ManualInput";
import ConfirmCard from "../components/ConfirmCard";
import Swal from 'sweetalert2'

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

const PayView: React.FC = () => {
  const [code, setCode] = useState(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const navigate = useNavigate();

  const confirm = () => {
  Swal.fire({
    text: 'ポイントが付与されました',
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#009688',
    focusConfirm: false,
    allowOutsideClick: false,
  }).then(() => {
    navigate("/");
  });
  };

  const comment = 'MTBコース整備活動ボランティアの参加ポイントです'
  return ( code ? <ConfirmCard callback={confirm} comment={comment}
    cardPicture={CardPicture} point={500} /> :
     (isManualInput ?  <ManualInput setCode={setCode} setExit={setIsManualInput} pay /> :
      <Scan setCode={setCode} setExit={setIsManualInput} />));
}

export default PayView;