"use client";
import{ X } from "lucide-react";
import Image from "next/image";
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css"
import React from 'react'

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}
const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const [imageData, setImageData] = React.useState("");
    const fileType = value?.split(".").pop();

    if(value && fileType !== "pdf" ){
        return (
            <div className="relative h-20 w-20 mx-auto">
                <Image
                    fill
                    src={value}
                    alt='Upload'
                    className="rounded-full"
                />
                <button
                    onClick={()=> onChange("")} 
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
  return (
    <UploadDropzone
  endpoint="serverImage"
  onClientUploadComplete={(res) => {
    console.log("✅ Upload complete:", res);

    const fileUrl = res?.[0]?.url;
    if (!fileUrl) {
        console.error("❌ No URL returned", res);
        return;
    }

    console.log("✅ Uploaded file URL:", fileUrl);
    onChange(fileUrl); // ✅ This is the key fix - notify parent
}}
onUploadError={(error: Error) => {
    console.error("❌ Upload failed:", error);
}}
onUploadBegin={(name) => {
    console.log("🚀 Upload starting:", name);
}}
/>

  )
}

export default FileUpload