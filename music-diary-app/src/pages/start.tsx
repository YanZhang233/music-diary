import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { spotifyAuthPKCE, exchangeCodeForToken } from '../apiCallers/auth';
import { LOCAL_STORAGE, spotifyAuthConfig } from '../config/authConfig';

const Start = () => {
    const {clientId, redirectUri, scopes} = spotifyAuthConfig;
    const [hasToken, setHasToken] = useState(!!localStorage.getItem(LOCAL_STORAGE.SPOTIFY_ACCESS_TOKEN));

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            exchangeCodeForToken(clientId, redirectUri, code);
            window.history.replaceState({}, '', window.location.pathname);
            setHasToken(true);
        }
    }, []);

    const handleLogin = () => {
        spotifyAuthPKCE({clientId, redirectUri, scopes});
    };

    return hasToken ? <div style={{fontSize: '48px'}}>🐱</div> : <Button variant="contained" onClick={handleLogin}>Login with Spotify</Button>;
}

export default Start;
