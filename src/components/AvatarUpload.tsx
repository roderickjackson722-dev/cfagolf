import { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete, size = 'lg' }: AvatarUploadProps) {
  const { user, profile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || 'U';

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if present
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Add cache-busting parameter
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onUploadComplete(publicUrl);
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);
    try {
      // Extract path from URL
      const path = currentAvatarUrl.split('/avatars/')[1]?.split('?')[0];
      if (path) {
        await supabase.storage.from('avatars').remove([path]);
      }

      // Update profile to remove avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      setPreviewUrl(null);
      onUploadComplete('');

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} border-4 border-background shadow-lg`}>
          <AvatarImage src={displayUrl || undefined} alt="Profile photo" />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Remove button */}
        {displayUrl && !uploading && (
          <button
            onClick={handleRemovePhoto}
            className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              {displayUrl ? 'Change Photo' : 'Upload Photo'}
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          JPG, PNG, or WebP. Max 5MB.
        </p>
      </div>
    </div>
  );
}
