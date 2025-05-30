"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/utils";

export default function UploadDealsCSV() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/deals/upload", formData);
      if (res?.status !== 200) throw new Error("Upload failed");
      toast.success("CSV uploaded successfully");
    } catch {
      toast.error("Error uploading CSV");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Upload Deals via CSV</h2>

      <Input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
