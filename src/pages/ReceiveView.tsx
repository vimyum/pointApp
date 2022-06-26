import { useRef, useState, useCallback } from "react";
import Typography from '@mui/material/Typography';


const ReceiveView: React.FC = () => {
  return (<div>
    <Typography component="div" variant="h2">
      QRコードを読み取ってポイントを使う
    </Typography>
  </div>)
}

export default ReceiveView;