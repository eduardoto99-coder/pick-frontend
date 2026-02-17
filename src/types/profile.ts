export type ProfilePhoto = {
  dataUrl: string;
  fileName: string;
  fileSize: number;
  lastModified: number;
};

export type ProfileDraft = {
  displayName: string;
  bio: string;
  whatsappNumber: string;
  linkedinUrl: string;
  instagramUrl: string;
  cities: string[];
  interests: string[];
  photo?: ProfilePhoto;
  existingPhotoUrl?: string;
  updatedAt?: string;
};

export type ProfileValidationErrors = {
  displayName?: string;
  bio?: string;
  whatsappNumber?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  photo?: string;
  cities?: string;
  interests?: string;
};

export type ProfileValidationResult = {
  isValid: boolean;
  errors: ProfileValidationErrors;
};
