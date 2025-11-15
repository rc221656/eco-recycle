import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  useEffect(() => {
    let mounted = true;
    const loadModel = async () => {
      try {
        const loaded = await tmImage.load(modelURL, metadataURL);
        if (mounted) model = loaded;
        console.log("✅ Model loaded");
      } catch (e) {
        console.error("❌ Model load error:", e);
      }
    };
    loadModel();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Open Camera
  const openCamera = async () => {
    try {
      console.log("🎥 Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      console.log("✅ Camera opened successfully");
      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      console.error("❌ Camera Error:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  // ✅ When stream updates, attach to video
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .then(() => console.log("🎬 Video playing"))
        .catch((err) => console.error("Playback error:", err));
    }
  }, [cameraOpen, stream]);

  // ✅ Close Camera
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

  // ✅ Detect Function
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !model) {
      toast({
        title: "Model not ready",
        description: "Please wait a few seconds and try again.",
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
      const prediction = await model.predict(canvas);
      const best = prediction.reduce((a, b) => (a.probability > b.probability ? a : b));

      console.log("🧠 Prediction:", best);

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
          description: "Try again with better lighting.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Detection error:", e);
    }
    setScanning(false);
    closeCamera();
  };

  const handleManualScan = (item: { points: number; name: string }) => {
    toast({
      title: `+${item.points} Eco Points!`,
      description: `${item.name} added manually.`,
    });
  };

  const items = [
    { id: "plastic", name: "Plastic Bottle", points: 20, icon: Wine, color: "from-blue-500 to-cyan-500" },
    { id: "tin", name: "Tin Can", points: 40, icon: Box, color: "from-gray-500 to-slate-500" },
  ];

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

          {stream && (
            <p className="text-green-500 text-center text-sm mt-2">
              ✅ Camera stream active
            </p>
          )}
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

      <Dialog open={cameraOpen} onOpenChange={(open) => !open && closeCamera()}>
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

export default Scanner;
