import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

interface PdfToJpgFileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const PdfToJpgFileUpload = ({ onFileSelected, disabled }: PdfToJpgFileUploadProps) => {
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
    maxFiles: 1,
    disabled,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed 
          transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-accent/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-12 text-center">
          <div
            className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300
              ${isDragActive ? "bg-primary/20 scale-110" : "bg-primary/10"}
            `}
          >
            {isDragActive ? (
              <FileText className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse your files
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
            <FileText className="w-4 h-4" />
            PDF files supported
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Fast conversion. Your files are never stored.
      </p>
    </div>
  );
};

export default PdfToJpgFileUpload;
