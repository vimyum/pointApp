import { useRef, useState, useCallback, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Webcam from "react-webcam";
import jsQR from "jsqr";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { Link, useNavigate } from "react-router-dom";

import CardPicture from '../assets/HKCardPicture.jpeg';
import ForestIcon from '@mui/icons-material/Forest';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const videoWidth = 540;
const videoHeight = 360;

const videoConstraints = {
  width: videoWidth,
  height: videoHeight,
  facingMode: "user",
};

const ReceiveView: React.FC = () => {
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [swalProps, setSwalProps] = useState({});
  const navigate = useNavigate();

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
      console.log("canvas.width: %o", canvas.width);
      if (canvas.width == 0) {
          setTimeout(() => { capture() }, 300)
          return;
      }
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // jsQRに渡す
      console.log("check QR..")
      const code = jsQR(imageData.data, canvas.width, canvas.height)

      // QRコードの読み取りに成功したらモーダル開く
      // 失敗したら再度実行
      if (code) {
          console.log("Detected QR! %o", code)
          // alert(code.data)
          setIsCaptured(true)
      } else {
          setTimeout(() => { capture() }, 300)
      }
    }
  }, [webcamRef, canvasRef]);

  const confirm = () => {
  // const MySwal = withReactContent(Swal)
  Swal.fire({
    text: '正常にポイントが付与されました',
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#009688',
    focusConfirm: false,
    allowOutsideClick: false,
  }).then(() => {
    navigate("/");
  });
  };

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
            <canvas ref={canvasRef} style={{width:"100%", visibility: "hidden"}} />
          </div>
    </Box>
  );

  const Confirm = () => (
    <Box sx={{textAlign: 'center', justifyContent: 'center', display: 'flex'}}>
      <Card sx={{ maxWidth: 345, my: 5 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={CardPicture}
      />
      <CardContent>
        <Typography gutterBottom variant="h3" component="span" sx={{display: 'inline-block', mx: 2}}>
          1,000
        </Typography>
        <Typography gutterBottom component="span" sx={{fontSize: '0.7em'}}>
           ポイント
        </Typography>
        <Typography variant="body2" color="text.secondary">
          コース整備ボランティア参加ポイントです。ご協力ありがとうございます。
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'space-around'}}>
        <Box sx={{flexGrow: "1"}} >
          <Button onClick={confirm} size="small" variant="contained" sx={{width: '80%'}}>受け取る</Button>
        </Box>
        <Box>
        <Button size="small" variant="outlined" sx={{width: '100%'}} component={Link}
      to="/" >キャンセル</Button>
        </Box>
      </CardActions>
    </Card>
    </Box>
  );

  return ( isCaptured ? Confirm() : QRScan());
}

export default ReceiveView;