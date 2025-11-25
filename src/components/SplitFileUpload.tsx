import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

interface SplitFileUploadProps {
  onFileSelected: (file: File) => void;
  hasFile: boolean;
}

const SplitFileUpload = ({ onFileSelected, hasFile }: SplitFileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file => file.type === "application/pdf");
    if (pdfFile) {
      onFileSelected(pdfFile);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-base bg-card
        ${isDragActive 
          ? "border-primary bg-accent" 
          : "border-border hover:border-primary hover:bg-accent/50"
        }
        ${hasFile ? "mb-8" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        {isDragActive ? (
          <>
            <FileText className="w-16 h-16 text-primary mb-4" />
            <p className="text-lg font-medium text-primary">Drop your PDF file here</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Drag & drop PDF file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your device
            </p>
            <p className="text-xs text-muted-foreground">
              Select one PDF file to split
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SplitFileUpload;
