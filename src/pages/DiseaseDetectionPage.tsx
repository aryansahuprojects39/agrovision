import { useState, useRef, useCallback, useEffect, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Leaf, AlertTriangle, CheckCircle, Sprout, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";

const Disease3DVisualization = lazy(() => import("@/components/Disease3DVisualization"));

interface DiagnosisResult {
  plant_name: string;
  disease: string;
  confidence: string;
  description: string;
  treatment: string[];
  prevention: string[];
  infected_area_percent: number;
  spread_pattern: string;
  severity_level: string;
  affected_zones: { x: number; y: number; radius: number }[];
}

const DiseaseDetectionPage = () => {
  const { user } = useAuth();
  const { trackActivity } = useActivityTracker();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => { trackActivity("disease_detection"); }, []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setImageFile(file);
    setResult(null);
    setShow3D(false);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile || !image) return;
    setLoading(true);
    setShow3D(false);
    try {
      const base64 = image.split(",")[1];
      const { data, error } = await supabase.functions.invoke("analyze-crop", {
        body: { image: base64, filename: imageFile.name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      // Show 3D visualization for all results (healthy or diseased)
      if (data.disease !== "Not a crop image") {
        setShow3D(true);
      }
      if (user) {
        await supabase.from("detection_history").insert({
          user_id: user.id,
          disease: data.disease,
          confidence: data.confidence,
          description: data.description,
          treatment: data.treatment,
          prevention: data.prevention,
        });
      }
      toast.success("Analysis complete!");
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">AI Crop Disease Detection</h1>
            <p className="text-muted-foreground mt-2">Upload a photo of your crop leaf — AI diagnoses diseases and shows results in interactive 3D</p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8 group" style={{ perspective: "1000px" }}>
            <CardContent className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
                style={{
                  transform: isDragging ? "rotateX(2deg) rotateY(-1deg) scale(1.02)" : "rotateX(0) rotateY(0) scale(1)",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                }}
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded crop"
                      className="max-h-64 mx-auto rounded-lg object-contain transition-transform duration-500 hover:scale-105"
                      style={{ filter: "drop-shadow(0 10px 20px hsl(var(--primary) / 0.15))" }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      style={{ boxShadow: "0 8px 24px hsl(var(--primary) / 0.15)" }}
                    >
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, or WEBP images</p>
                    {isDragging && (
                      <p className="text-sm font-semibold text-primary animate-pulse">Drop your image here!</p>
                    )}
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button onClick={handleAnalyze} disabled={!image || loading} className="flex-1">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Leaf className="mr-2 h-4 w-4" />}
                  {loading ? "Analyzing..." : "Analyze Crop"}
                </Button>
                {image && (
                  <Button variant="outline" onClick={() => { setImage(null); setImageFile(null); setResult(null); setShow3D(false); }}>
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Left: Diagnosis Info */}
              <Card className="overflow-hidden" style={{ boxShadow: "0 20px 40px hsl(var(--primary) / 0.1)" }}>
                <CardHeader className="bg-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plant Identified</p>
                      <p className="text-lg font-bold text-foreground">{result.plant_name || "Unknown Plant"}</p>
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2 mt-3">
                    {result.disease === "Healthy" ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-secondary" />
                    )}
                    Diagnosis: {result.disease}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Confidence: {result.confidence}</p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Description</h3>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </div>
                  {result.treatment.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Treatment</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.treatment.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.prevention.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Prevention</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.prevention.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}

                  {result.disease !== "Healthy" && result.disease !== "Not a crop image" && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShow3D(!show3D)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {show3D ? "Hide 3D Visualization" : "View 3D Visualization"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Right: 3D Visualization */}
              {show3D && result.disease !== "Healthy" && result.disease !== "Not a crop image" && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      3D Disease Visualization
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Rotate the plant model and zoom into infected areas
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={
                      <div className="h-[350px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    }>
                      <Disease3DVisualization
                        data={{
                          disease: result.disease,
                          severity_level: result.severity_level || "moderate",
                          infected_area_percent: result.infected_area_percent || 30,
                          spread_pattern: result.spread_pattern || "spots",
                          affected_zones: result.affected_zones || [
                            { x: 0.3, y: 0.5, radius: 0.15 },
                            { x: 0.7, y: 0.6, radius: 0.1 },
                          ],
                        }}
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              )}

              {/* Show placeholder if healthy */}
              {(result.disease === "Healthy") && (
                <Card className="flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground">Plant is Healthy!</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      No disease detected. Your crop looks great! 🌱
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
