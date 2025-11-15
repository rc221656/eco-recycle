import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as tmImage from "@teachablemachine/image";

const modelURL = "/model/model.json";
const metadataURL = "/model/metadata.json";

let model: tmImage.CustomMobileNet | null = null;

interface ScannerProps {
  onPointsEarned: (points: number) => void;
}

export default function Scanner({ onPointsEarned }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);

  const { toast } = useToast();

  // -------------------------------
  // LOAD MODEL
  // -------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("✅ AI Model Loaded");
      } catch (err) {
        console.error("❌ Model Load Error:", err);
      }
    };
    load();
  }, []);

  // -------------------------------
  // OPEN CAMERA
  // -------------------------------
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setStream(mediaStream);
      setCameraEnabled(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current
            .play()
            .then(() => console.log("🎥 Camera Started"))
            .catch(() => {});
        }
      }, 200);
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        title: "Camera blocked",
        description: "Please allow camera access in browser settings.",
        variant: "destructive",
      });
    }
  };

  // -------------------------------
  // CLOSE CAMERA
  // -------------------------------
  const closeCamera = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraEnabled(false);
  };

  // -------------------------------
  // DETECTION LOGIC (AUTO CLASS FIX)
  // -------------------------------
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !model) {
      toast({
        title: "Model not ready",
        description: "Wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setScanning(true);

    try {
      const predictions = await model.predict(canvas);
      const best = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );

      console.log("🧠 Prediction:", best);

      // Normalize class name (makes ANY model name work)
      const className = best.className.toLowerCase().replace(/\s/g, "");

      let points = 0;

      if (className.includes("bottle") || className.includes("plastic")) {
        points = 20;
      } else if (className.includes("can") || className.includes("tin")) {
        points = 40;
      } else {
        points = 0;
      }

      if (best.probability > 0.70 && points > 0) {
        onPointsEarned(points);
        toast({
          title: `+${points} Eco Points!`,
          description: `${best.className} detected.`,
        });
      } else {
        toast({
          title: "Invalid Item",
          description: "This item is not recognized.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Detection error:", err);
    }

    setScanning(false);
  };

  const items = [
    { name: "Plastic Bottle", points: 20 },
    { name: "Tin Can", points: 40 },
  ];

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="px-4 py-10 max-w-4xl mx-auto text-center">

      <h2 className="text-3xl font-bold mb-3">Scan Your Items</h2>
      <p className="text-muted-foreground mb-6">Detect recyclables using AI</p>

      <Button size="lg" className="mb-6" onClick={openCamera}>
        <Camera className="w-5 h-5 mr-2" />
        Open Camera
      </Button>

      {cameraEnabled && (
        <div className="border rounded-lg p-3 bg-black max-w-xl mx-auto mb-6">
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg"
          />

          <canvas ref={canvasRef} className="hidden" />

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={captureAndDetect}
            disabled={scanning}
          >
            {scanning ? "Detecting..." : "Capture & Detect"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full mt-2"
            onClick={closeCamera}
          >
            Close Camera
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {items.map((item) => (
          <Card key={item.name} className="p-6">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-muted-foreground mb-3">
              +{item.points} points
            </p>
            <Button
              onClick={() => {
                toast({
                  title: `+${item.points} Eco Points!`,
                  description: `${item.name} added manually.`,
                });
                onPointsEarned(item.points);
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Manually
            </Button>
          </Card>
        ))}
      </div>

    </div>
  );
}
