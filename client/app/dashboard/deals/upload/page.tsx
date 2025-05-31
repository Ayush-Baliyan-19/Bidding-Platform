"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { api } from "@/lib/utils";

interface UploadResult {
  success: boolean;
  total: number;
  inserted: number;
  errors?: string[];
}

export default function UploadDealsCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        toast.error("Please select a valid CSV file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 10MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFile(selectedFile);
      setUploadResult(null); // Clear previous results
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const res = await api.post("/deals/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      });

      if (res?.status === 201 || res?.status === 200) {
        const result = res.data as UploadResult;
        setUploadResult(result);

        if (result.success) {
          toast.success(`Successfully uploaded ${result.inserted} deals`);
          // Clear the file input
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          toast.error("Upload completed with errors. Check details below.");
        }
      } else {
        throw new Error("Unexpected response status");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error uploading CSV:", error);

      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 400) {
        toast.error("Invalid CSV format. Please check your file.");
      } else if (error?.response?.status === 413) {
        toast.error("File too large. Please reduce file size.");
      } else {
        toast.error("Failed to upload CSV. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `transporter_name,material,amount,distance_km,date
ABC Transporters,Steel,50000,150,2024-01-15
XYZ Logistics,Cement,25000,100,2024-01-16`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deals_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Template downloaded successfully");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Deals via CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CSV Format Instructions */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">CSV Format Requirements:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • Required columns: transporter_name, material, amount,
                    distance_km, date
                  </li>
                  <li>• Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
                  <li>• Amount should be numeric (without currency symbols)</li>
                  <li>• Distance should be numeric (in kilometers)</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Download Template Button */}
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="csv-file" className="text-sm font-medium">
                Select CSV File
              </label>
              <Input
                id="csv-file"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>

            {file && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p>
                  <strong>Selected file:</strong> {file.name}
                </p>
                <p>
                  <strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>

          {/* Upload Results */}
          {uploadResult && (
            <Alert
              className={
                uploadResult.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">
                    {uploadResult.success
                      ? "Upload Successful!"
                      : "Upload Completed with Issues"}
                  </div>
                  <div className="text-sm">
                    <p>Total records processed: {uploadResult.total}</p>
                    <p>Successfully inserted: {uploadResult.inserted}</p>
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-red-600">Errors:</p>
                        <ul className="ml-4 space-y-1">
                          {uploadResult.errors.map((error, index) => (
                            <li key={index} className="text-red-600">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
