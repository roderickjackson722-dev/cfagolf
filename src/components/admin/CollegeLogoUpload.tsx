import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollegeLogoUploadProps {
  currentLogoUrl: string | null;
  onUpload: (file: File) => Promise<string>;
  isUploading: boolean;
  onLogoChange: (url: string | null) => void;
}

export function CollegeLogoUpload({
  currentLogoUrl,
  onUpload,
  isUploading,
  onLogoChange,
}: CollegeLogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const url = await onUpload(file);
      onLogoChange(url);
    } catch (error) {
      setPreview(currentLogoUrl);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">College Logo</label>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden",
            "border-muted-foreground/25 bg-muted/50"
          )}
        >
          {preview ? (
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </>
            )}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Recommended: PNG or SVG, 200x200px or larger
      </p>
    </div>
  );
}
