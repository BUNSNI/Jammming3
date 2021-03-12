let accessToken;
const clientId = '3e33e699be6346d1a5210d41cad4dc67';
const redirectUri = "http://localhost:3000/";

const Spotify = {
    getAccessToken() {
        if (accessToken){
            return accessToken;
        }

        // this is a check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // The following code clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }

    },


    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(
            `https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    Authorization : `Bearer ${accessToken}`
                }
            }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks){
                return [];
            } else {
                console.log(jsonResponse.tracks.items)
                return jsonResponse.tracks.items.map(track => ({
                    id : track.id,
                    name : track.name,
                    artist : track.artists.name,
                    album : track.album.name,
                    uri : track.uri,
                }))
            }
                
        })
    },


    savePlaylist(name, trackUris) {
        if (!name || !trackUris){
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { 
            Authorization : `Bearer ${accessToken}`};
        let userId;
        return fetch('https://api.spotify.com/v1/me',
        {
            headers : headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse.id)
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers : headers,
                method : 'POST',
                body : JSON.stringify({name : name})
            }).then(response => {
                return response.json()
            }).then(jsonResponse => {
                console.log(jsonResponse)
                const playlistId = jsonResponse.id
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
        {
            headers : headers,
            method : 'POST',
            body : JSON.stringify({uri : trackUris})
            })
        })
        })
    }
}



export default Spotify;