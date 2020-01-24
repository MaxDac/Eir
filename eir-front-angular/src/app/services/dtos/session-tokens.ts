export interface SessionTokens {
  headerToken: string;
  cookieToken: string;
  userId?: number | null;
  characterId?: number | null;
  characterName?: string | null;
}
