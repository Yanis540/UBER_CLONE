
export type GoogleUser = {
    user: {
        id: string;
        name: string | null;
        email: string;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
      };
    scopes?: string[];
    idToken: string | null;
    
    serverAuthCode: string | null;
}