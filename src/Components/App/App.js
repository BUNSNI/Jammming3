import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      
      searchResults: [],

      playlistName: ['My Fave Playlist'],

      playlistTracks: [],

      }

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
    }

  
  removeTrack(track) {
    console.log(track.id)
    let pos = this.state.playlistTracks.map(x => x.id)
    let index = pos.indexOf(track.id)
    this.state.playlistTracks.splice(index, 1)
    this.setState({playlistTracks : this.state.playlistTracks})
  }

  
  addTrack(track) {
    if (this.state.playlistTracks.find(x =>
      x.id === track.id)) {
        return;
        } else {
          this.state.playlistTracks.push(track)
          this.setState({playlistTracks : this.state.playlistTracks})
        }
      }

  
  updatePlaylistName(name) {
    this.setState({playlistName : name})
  }


  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(x => x.uri)
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName : 'New PLaylist',
        playlistTracks : []
      })
    })
  }


  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults : searchResults,
      })
    })
  }
  

  render() {
    return (
      <div>
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
              <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
