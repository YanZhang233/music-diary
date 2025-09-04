import { LOCAL_STORAGE } from "../config/authConfig";
import { SpotifyAuthConfig } from "../interfaces";

interface PKCETokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface CodeChallenge {
  codeVerifier: string;
  codeChallenge: string;
}

// Generate code verifier and challenge for PKCE
const generateCodeChallenge = async (): Promise<CodeChallenge> => {
  const codeVerifier = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return { codeVerifier, codeChallenge };
}

// Authorization Code with PKCE Flow
const spotifyAuthPKCE = async (spotifyAuthConfig: SpotifyAuthConfig): Promise<string> => {
    const { codeVerifier, codeChallenge } = await generateCodeChallenge();

    const { clientId, redirectUri, scopes } = spotifyAuthConfig;

    // Store code verifier for token exchange
    console.log("Storing codeVerifier in localStorage...")
    localStorage.setItem(LOCAL_STORAGE.SPOTIFY_CODE_VERIFIER, codeVerifier);
    const code = localStorage.getItem(LOCAL_STORAGE.SPOTIFY_CODE_VERIFIER);
    console.log("Getting codeVerifier from localStorage...", code)
  
    // Redirect to Spotify authorization
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    const params =  {
        response_type: 'code',
        client_id: clientId,
        scope: scopes.join(" "),
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();

    return codeVerifier;
}

// Exchange authorization code for access token
const exchangeCodeForToken = async (clientId: string, redirectUri: string, code: string) => {
    // stored in the previous step
    const codeVerifier = localStorage.getItem(LOCAL_STORAGE.SPOTIFY_CODE_VERIFIER);
    if (!codeVerifier) {
        throw new Error("Code verifier not found in local storage!");
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const params: Record<string, string> = {
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    }
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
    }

  const body = await fetch(tokenUrl, payload);
  const response = await body.json();
  console.log("response: ", response);

  window.history.replaceState({}, '', window.location.pathname);

  localStorage.setItem(LOCAL_STORAGE.SPOTIFY_ACCESS_TOKEN, response.access_token);
  // localStorage.removeItem(LOCAL_STORAGE.SPOTIFY_CODE_VERIFIER);

  return response.json();
}

export { spotifyAuthPKCE, exchangeCodeForToken };

