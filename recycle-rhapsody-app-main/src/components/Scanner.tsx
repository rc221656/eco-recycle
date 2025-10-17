import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wine, Box, Plus, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as tmImage from "@teachablemachine/image";

// === AI Model Config ===
const modelURL = "/model/model.json";
const metadataURL = "/model/metadata.json";
let model: tmImage.CustomMobileNet | null = null;

// === Load the model once ===
const loadModel = async () => {
  try {
    model = await tmImage.load(modelURL, metadataURL);
    console.log("✅ AI model loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load model:", error);
  }
};

interface ScannerProps {
  onPointsEarned: (points: number) => void;
}

const Scanner = ({ onPointsEarned }: ScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadModel();
  }, []);

  const items = [
    { id: "plastic", name: "Plastic Bottle", points: 20, icon: Wine, color: "from-blue-500 to-cyan-500" },
    { id: "tin", name: "Tin Can", points: 40, icon: Box, color: "from-gray-500 to-slate-500" },
  ];

  // === Fix for black screen / camera not showing ===
  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Camera not supported",
          description: "Your browser does not support camera access.",
          variant: "destructive",
        });
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const backCamera = devices.find(
        (device) =>
          device.kind === "videoinput" && device.label.toLowerCase().includes("back")
      );

      const constraints = {
        video: backCamera
          ? { deviceId: { exact: backCamera.deviceId } }
          : { facingMode: { ideal: "environment" } },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("📷 Camera stream started"))
            .catch((err) => console.error("Camera play error:", err));
        }
      }
    } catch (error) {
      console.error("Camera Error:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access in browser settings.",
        variant: "destructive",
      });
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !model) {
      toast({
        title: "Model not ready",
        description: "Please wait a few seconds and try again",
        variant: "destructive",
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    setScanning(true);

    try {
      const prediction = await model.predict(canvas);
      const best = prediction.reduce((prev, curr) =>
        curr.probability > prev.probability ? curr : prev
      );

      console.log("Prediction:", best);

      if (best.probability > 0.8) {
        const points = best.className.includes("Bottle") ? 20 : 40;
        onPointsEarned(points);
        toast({
          title: `+${points} Eco Points!`,
          description: `${best.className} detected successfully!`,
        });
      } else {
        toast({
          title: "No recognizable item found",
          description: "Try scanning again under good lighting",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast({
        title: "Detection failed",
        description: "Error analyzing the image",
        variant: "destructive",
      });
    }

    setScanning(false);
    closeCamera();
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Scan Your Items</h2>
          <p className="text-muted-foreground text-lg">
            Use your camera to scan items or select manually
          </p>

          <Button size="lg" className="mt-6" onClick={openCamera}>
            <Camera className="w-5 h-5 mr-2" />
            Scan Items with Camera
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="p-8 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="text-center space-y-6">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4 text-primary" />
                      <span className="text-3xl font-bold text-primary">{item.points}</span>
                      <span className="text-muted-foreground">points</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleManualScan(item)}
                    disabled={scanning}
                  >
                    {scanning ? "Scanning..." : "Scan Now"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={cameraOpen} onOpenChange={closeCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Recyclable Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain bg-black rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={captureAndDetect}
                disabled={scanning}
              >
                <Camera className="w-5 h-5 mr-2" />
                {scanning ? "Detecting..." : "Capture & Detect"}
              </Button>
              <Button size="lg" variant="outline" onClick={closeCamera}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Manual scan for static buttons
const handleManualScan = (item: { points: number; name: string }) => {
  const { toast } = useToast();
  toast({
    title: `+${item.points} Eco Points!`,
    description: `${item.name} added manually.`,
  });
};

export default Scanner;
