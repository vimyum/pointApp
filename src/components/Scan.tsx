import { useRef, useState, useCallback, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Webcam from "react-webcam";
import jsQR from "jsqr";

import { Link, useNavigate } from "react-router-dom";

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

interface ScanProps {
  setCode: any;
  interval?: number;
}

const Scan: React.FC<ScanProps> = ({setCode, interval = 200}: ScanProps) => {

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const capture = useCallback(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (video?.video && canvas && ctx) {

      canvas.width = video.video.videoWidth;
      canvas.height = video.video.videoHeight;

      ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
      if (canvas.width == 0) {
          setTimeout(() => { capture() }, interval)
          return;
      }
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      console.log("check QR..")
      const code = jsQR(imageData.data, canvas.width, canvas.height)

      if (code) {
          console.log("Detected QR! %o", code)
          setCode(code.data);
      } else {
          setTimeout(() => { capture() }, 300)
      }
    }
  }, [webcamRef, canvasRef]);

  useEffect(() => {
    console.log("start timer..")
    setTimeout(() => { capture() }, 200);
  },[canvasRef]);

  const QRScan = () => (
    <Box sx={{textAlign: 'center'}}>
        <Typography component="div" variant="h6" sx={{my:3}}>
          QRコードをかざしてください
        </Typography>
            <Webcam
              audio={false}
              width={videoWidth}
              height={videoHeight}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          <div>
            <canvas ref={canvasRef} style={{width:"100%", display: "none"}} />
            <Button variant="outlined">手動で入力する</Button>
          </div>
    </Box>
  );

  return QRScan();
}

export default Scan;