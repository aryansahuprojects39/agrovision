import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DiagnosisResult {
  disease: string;
  confidence: string;
  description: string;
  treatment: string[];
  prevention: string[];
}

const DiseaseDetectionPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile || !image) return;
    setLoading(true);
    try {
      const base64 = image.split(",")[1];
      const { data, error } = await supabase.functions.invoke("analyze-crop", {
        body: { image: base64, filename: imageFile.name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">AI Crop Disease Detection</h1>
            <p className="text-muted-foreground mt-2">Upload a photo of your crop leaf and our AI will diagnose potential diseases</p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {image ? (
                  <img src={image} alt="Uploaded crop" className="max-h-64 mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground">Upload Crop Leaf Photo</p>
                    <p className="text-sm text-muted-foreground">Click or drag to upload a JPG, PNG, or WEBP image</p>
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
                  <Button variant="outline" onClick={() => { setImage(null); setImageFile(null); setResult(null); }}>
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.disease === "Healthy" ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-secondary" />
                  )}
                  Diagnosis: {result.disease}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Confidence: {result.confidence}</p>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
