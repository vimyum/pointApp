import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import './App.css'

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

function App() {
  const width = 540;
  const height = 360;
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const capture = useCallback(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (video?.video && canvas && ctx) {

      canvas.width = video.video.videoWidth;
      canvas.height = video.video.videoHeight;

      ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // jsQRに渡す
      console.log("check QR..")
      const code = jsQR(imageData.data, canvas.width, canvas.height)

      // QRコードの読み取りに成功したらモーダル開く
      // 失敗したら再度実行
      if (code) {
          console.log("Detected QR! %o", code)
          alert(code.data)
      } else {
          setTimeout(() => { capture() }, 1000)
      }
    }
  }, [webcamRef]);

  return (
    <div className="App">
      <div>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          <div>
            <button onClick={capture}>Capture</button>
            <canvas ref={canvasRef}/>
          </div>
      </div>
    </div>
  )
}

export default App
