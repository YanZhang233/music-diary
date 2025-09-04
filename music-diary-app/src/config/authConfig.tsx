import { SpotifyAuthConfig } from "../interfaces";

export const spotifyAuthConfig: SpotifyAuthConfig = {
    clientId: "f301dbcfa25f4e1bb09df06f88540a08",
    redirectUri: "http://127.0.0.1:5173",
    scopes: ['user-top-read'],
}

export const LOCAL_STORAGE = {
    SPOTIFY_CODE_VERIFIER: 'spotify_code_verifier',
    SPOTIFY_ACCESS_TOKEN: 'access_token',
}
