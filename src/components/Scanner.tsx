import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wine, Box, Plus, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as tmImage from "@teachablemachine/image";

const modelURL = "/model/model.json";
const metadataURL = "/model/metadata.json";

let model: tmImage.CustomMobileNet | null = null;

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

  // Load Model Once
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        const loaded = await tmImage.load(modelURL, metadataURL);
        if (mounted) model = loaded;
        console.log("✅ Model loaded successfully");
      } catch (e) {
        console.error("❌ Model load error:", e);
      }
    };

    loadModel();
    return () => {
      mounted = false;
    };
  }, []);

  // Open Camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      toast({
        title: "Camera access blocked",
        description: "Please allow camera access in browser settings.",
        variant: "destructive",
      });
    }
  };

  // Attach stream to video
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;

      videoRef.current
        .play()
        .then(() => console.log("🎬 Video is playing"))
        .catch((err) => console.error("Playback error:", err));
    }
  }, [cameraOpen, stream]);

  // Close Camera
  const closeCamera = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setCameraOpen(false);
  };

  // Capture + Predict
  const captureAndDetect = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !model) {
      toast({
        title: "Model not ready",
        description: "Please wait and try again.",
        variant: "destructive",
      });
      return;
    }

    // Fix: Ensure camera is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast({
        title: "Camera not ready",
        description: "Please wait 1 second and retry.",
        variant: "destructive",
      });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame onto canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    setScanning(true);

    try {
      const prediction = await model.predict(canvas);

      const best = prediction.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );

      console.log("Prediction:", best);

      if (best.probability > 0.8) {
        const points = best.className.includes("Bottle") ? 20 : 40;

        onPointsEarned(points);

        toast({
          title: `+${points} Eco Points!`,
          description: `${best.className} detected`,
        });
      } else {
        toast({
          title: "Item not detected",
          description: "Please try again with better lighting.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Detection error:", e);
    }

    setScanning(false);
    closeCamera();
  };

  const items = [
    { id: "plastic", name: "Plastic Bottle", points: 20, icon: Wine },
    { id: "tin", name: "Tin Can", points: 40, icon: Box },
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Scan Your Items</h2>
          <p className="text-muted-foreground text-lg">
            Use your camera to scan recyclable items
          </p>

          <Button size="lg" className="mt-6" onClick={openCamera}>
            <Camera className="w-5 h-5 mr-2" />
            Scan Items with Camera
          </Button>
        </div>

        <Dialog open={cameraOpen} onOpenChange={(open) => !open && closeCamera()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Scan Recyclable Item</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* FIXED VIDEO + CANVAS */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    background: "black",
                  }}
                />

                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  style={{ display: "none" }}
                />
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
    </div>
  );
};

export default Scanner;
