export interface LinkResponse {
  id: string;
  originalUrl: string;
  customAlias: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
}

export interface AliasAvailabilityResult {
  available: boolean;
  message: string;
}
