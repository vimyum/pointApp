import { useRef, useState, useCallback, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Webcam from "react-webcam";
import jsQR from "jsqr";

const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

interface ScanProps {
  setCode: any;
  setExit: any;
  interval?: number;
}

const Scan: React.FC<ScanProps> = ({setCode, setExit, interval = 200}: ScanProps) => {
  const [timerId, setTimerId] = useState<number>(0);
  const [useManualInput, setUseManualInput] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)

const manualHandler = () => {
    clearTimeout(timerId);
    setUseManualInput(true);
}

  const capture = useCallback(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!video || !video.video || !canvas || !ctx || !video.video.videoWidth) {
          setTimerId(setTimeout(() => { capture() }, interval));
          return;
    }
      canvas.width = video.video.videoWidth;
      canvas.height = video.video.videoHeight;

      ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      console.log("check QR..")
      const code = jsQR(imageData.data, canvas.width, canvas.height)

      if (code) {
          console.log("Detected QR! %o", code)
          setCode(code.data);
      } else {
          setTimerId(setTimeout(() => { capture() }, interval));
      }
  }, [webcamRef, canvasRef]);


  useEffect(() => {
    console.log("start timer..")
    setTimerId(setTimeout(() => { capture() }, interval));
  },[]);

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
            <Button variant="outlined" onClick={()=> setExit(true) }>手動で入力する</Button>
          </div>
    </Box>
  );

  return QRScan();
}

export default Scan;