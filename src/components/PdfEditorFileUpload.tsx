import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

interface PdfEditorFileUploadProps {
  onFileSelected: (file: File) => void;
  hasFile: boolean;
}

const PdfEditorFileUpload = ({ onFileSelected, hasFile }: PdfEditorFileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  if (hasFile) {
    return null;
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-2xl p-12
        transition-all duration-300 cursor-pointer
        ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }
      `}
    >
      <input {...getInputProps()} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div
          className={`
            w-20 h-20 rounded-2xl flex items-center justify-center mb-6
            transition-all duration-300
            ${isDragActive ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary"}
          `}
        >
          {isDragActive ? (
            <FileText className="w-10 h-10 animate-pulse" />
          ) : (
            <Upload className="w-10 h-10" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isDragActive ? "Drop your PDF here" : "Upload PDF to Edit"}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          Drag & drop or click to select a PDF file
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-secondary">Add Text</span>
          <span className="px-3 py-1 rounded-full bg-secondary">Draw</span>
          <span className="px-3 py-1 rounded-full bg-secondary">Shapes</span>
          <span className="px-3 py-1 rounded-full bg-secondary">Images</span>
          <span className="px-3 py-1 rounded-full bg-secondary">Rearrange</span>
        </div>
      </div>
    </div>
  );
};

export default PdfEditorFileUpload;
