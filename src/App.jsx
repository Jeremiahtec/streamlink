import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, Search, Home, Music, User, LogOut, Moon, Sun, Upload, Plus, Edit2, Trash2, X, Library, TrendingUp } from 'lucide-react';

// Mock Auth & Data (In production, use Firebase/Supabase)
const mockUsers = {
  admin: { email: 'admin@streamlink.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  user: { email: 'user@streamlink.com', password: 'user123', role: 'user', name: 'John Doe' }
};

const initialSongs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Night Sessions",
    genre: "Electronic",
    duration: "3:45",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Summer Vibes",
    artist: "The Wave Riders",
    album: "Coastal Dreams",
    genre: "Pop",
    duration: "4:12",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Urban Nights",
    artist: "City Lights",
    album: "Metropolitan",
    genre: "Hip Hop",
    duration: "3:28",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Acoustic Sunrise",
    artist: "Mountain Echo",
    album: "Natural Sounds",
    genre: "Acoustic",
    duration: "4:56",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Electric Storm",
    artist: "Voltage Crew",
    album: "Power Surge",
    genre: "EDM",
    duration: "3:33",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];

const initialPlaylists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Relax and unwind",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    songs: [1, 2, 4]
  },
  {
    id: 2,
    name: "Workout Mix",
    description: "High energy tracks",
    cover: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop",
    songs: [3, 5]
  },
  {
    id: 3,
    name: "Evening Jazz",
    description: "Smooth jazz for relaxation",
    cover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
    songs: [1, 4]
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [songs, setSongs] = useState(initialSongs);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeat]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audio;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  const handleLogin = (email, password) => {
    const foundUser = Object.values(mockUsers).find(
      u => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      setCurrentView('home');
    } else {
      alert('Invalid credentials. Try:\nAdmin: admin@streamlink.com / admin123\nUser: user@streamlink.com / user123');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentView('home');
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const nextIndex = shuffle 
      ? Math.floor(Math.random() * songs.length)
      : (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleFavorite = (songId) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <AuthScreen onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (

<div className={`${darkMode ? 'dark' : ''} overflow-x-hidden`}> 
      <div
  className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-black dark:to-black transition-colors duration-300"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex min-h-screen">
          <Sidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            userRole={user.role}
            darkMode={darkMode}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar 
              user={user}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="flex-1 overflow-y-auto pb-32">
              {currentView === 'home' && (
                <HomeView 
                  playlists={playlists}
                  songs={songs}
                  onPlaylistClick={(playlist) => {
                    setSelectedPlaylist(playlist);
                    setCurrentView('playlist');
                  }}
                  onSongClick={playSong}
                  darkMode={darkMode}
                />
              )}
              {currentView === 'search' && (
                <SearchView 
                  songs={filteredSongs}
                  onSongClick={playSong}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  darkMode={darkMode}
                />
              )}
              {currentView === 'library' && (
                <LibraryView 
                  songs={songs.filter(s => favorites.includes(s.id))}
                  onSongClick={playSong}
                  darkMode={darkMode}
                />
              )}
              {currentView === 'playlist' && selectedPlaylist && (
                <PlaylistView 
                  playlist={selectedPlaylist}
                  songs={songs}
                  onSongClick={playSong}
                  onBack={() => setCurrentView('home')}
                  darkMode={darkMode}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              )}
              {currentView === 'admin' && user.role === 'admin' && (
                <AdminDashboard 
                  songs={songs}
                  setSongs={setSongs}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                  darkMode={darkMode}
                />
              )}
            </div>

            {currentSong && (
              <MusicPlayer 
                song={currentSong}
                isPlaying={isPlaying}
                onPlayPause={togglePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
                shuffle={shuffle}
                setShuffle={setShuffle}
                repeat={repeat}
                setRepeat={setRepeat}
                progress={progress}
                duration={duration}
                onProgressChange={handleProgressChange}
                isFavorite={favorites.includes(currentSong.id)}
                onToggleFavorite={() => toggleFavorite(currentSong.id)}
                formatTime={formatTime}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
        <audio ref={audioRef} />
      </div>
    </div>
  );
}

function AuthScreen({ onLogin, darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
  <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-white dark:from-black dark:via-green-900 dark:to-black flex items-center justify-center p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
        </button>
        
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-white mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">StreamLink</h1>
              <p className="text-white/80">Your premium music experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/90 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-500 to-white text-white rounded-xl font-semibold hover:from-green-600 hover:to-white transform hover:scale-105 transition-all shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/70 text-sm mb-2">Demo Credentials:</p>
              <p className="text-white/90 text-xs font-mono">Admin: admin@streamlink.com / admin123</p>
              <p className="text-white/90 text-xs font-mono">User: user@streamlink.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ currentView, setCurrentView, userRole, darkMode }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  if (userRole === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Upload });
  }

  return (
    <div className="w-64 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-white flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
        </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-white dark:from-green-400 dark:to-black bg-clip-text text-transparent">
          StreamLink
        </span>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-gradient-to-r from-green-500 to-white text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Navbar({ user, onLogout, darkMode, setDarkMode, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-white flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeView({ playlists, songs, onPlaylistClick, onSongClick, darkMode }) {
  const trendingSongs = songs.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Trending Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {trendingSongs.map(song => (
            <SongCard key={song.id} song={song} onClick={() => onSongClick(song)} darkMode={darkMode} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => onPlaylistClick(playlist)}
              className="group cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-2xl hover:scale-105 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img src={playlist.cover} alt={playlist.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{playlist.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{playlist.description}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">{playlist.songs.length} songs</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SongCard({ song, onClick, darkMode }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-105 border border-gray-200/50 dark:border-gray-700/50"
    >
          <div className="relative mb-3 overflow-hidden rounded-lg">
        <img src={song.cover} alt={song.title} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{song.title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{song.artist}</p>
    </div>
  );
}

function SearchView({ songs, onSongClick, favorites, toggleFavorite, darkMode }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h2>
      {songs.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No songs found. Try a different search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-800 transition-all group border border-gray-200/50 dark:border-gray-700/50"
            >
              <span className="text-gray-500 dark:text-gray-400 w-6 text-sm">{index + 1}</span>
              <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{song.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist} • {song.album}</p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{song.duration}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song.id);
                }}
                className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-all"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(song.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={() => onSongClick(song)}
                className="p-2 hover:bg-green-500 rounded-full transition-all group-hover:bg-green-500/20"
              >
                <Play className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-green-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryView({ songs, onSongClick, darkMode }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Heart className="w-8 h-8 fill-red-500 text-red-500" />
        Favorite Songs
      </h2>
      {songs.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No favorites yet. Start adding some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {songs.map(song => (
            <SongCard key={song.id} song={song} onClick={() => onSongClick(song)} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlaylistView({ playlist, songs, onSongClick, onBack, darkMode, favorites, toggleFavorite }) {
  const playlistSongs = songs.filter(s => playlist.songs.includes(s.id));

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-900 dark:text-white"
      >
        ← Back
      </button>

      <div className="flex items-start gap-6 mb-8">
        <img src={playlist.cover} alt={playlist.name} className="w-48 h-48 rounded-2xl shadow-2xl object-cover" />
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{playlist.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{playlist.description}</p>
          <p className="text-gray-500 dark:text-gray-500">{playlistSongs.length} songs</p>
        </div>
      </div>

      <div className="space-y-2">
        {playlistSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-800 transition-all group border border-gray-200/50 dark:border-gray-700/50"
          >
            <span className="text-gray-500 dark:text-gray-400 w-6 text-sm">{index + 1}</span>
            <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">{song.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist}</p>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{song.duration}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(song.id);
              }}
              className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-all"
            >
              <Heart className={`w-5 h-5 ${favorites.includes(song.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={() => onSongClick(song)}
              className="p-2 hover:bg-green-500 rounded-full transition-all group-hover:bg-green-500/20"
            >
              <Play className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-green-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ songs, setSongs, playlists, setPlaylists, darkMode }) {
  const [activeTab, setActiveTab] = useState('songs');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    cover: '',
    audio: ''
  });

  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    cover: '',
    songs: []
  });

  const handleAddSong = () => {
    if (!newSong.title || !newSong.artist) {
      alert('Please fill in at least title and artist');
      return;
    }

    const song = {
      id: Date.now(),
      ...newSong
    };

    setSongs([...songs, song]);
    setNewSong({ title: '', artist: '', album: '', genre: '', duration: '', cover: '', audio: '' });
    setShowAddSong(false);
  };

  const handleUpdateSong = () => {
    setSongs(songs.map(s => s.id === editingSong.id ? editingSong : s));
    setEditingSong(null);
  };

  const handleDeleteSong = (id) => {
    if (confirm('Are you sure you want to delete this song?')) {
      setSongs(songs.filter(s => s.id !== id));
    }
  };

  const handleAddPlaylist = () => {
    if (!newPlaylist.name) {
      alert('Please enter a playlist name');
      return;
    }

    const playlist = {
      id: Date.now(),
      ...newPlaylist
    };

    setPlaylists([...playlists, playlist]);
    setNewPlaylist({ name: '', description: '', cover: '', songs: [] });
    setShowAddPlaylist(false);
  };

  const handleUpdatePlaylist = () => {
    setPlaylists(playlists.map(p => p.id === editingPlaylist.id ? editingPlaylist : p));
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = (id) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(playlists.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddSong(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Song
          </button>
          <button
            onClick={() => setShowAddPlaylist(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Playlist
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'songs'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
          }`}
        >
          Songs ({songs.length})
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'playlists'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
          }`}
        >
          Playlists ({playlists.length})
        </button>
      </div>

      {activeTab === 'songs' && (
        <div className="space-y-3">
          {songs.map(song => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <img src={song.cover} alt={song.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{song.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist} • {song.album}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                {song.genre}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{song.duration}</span>
              <button
                onClick={() => setEditingSong(song)}
                className="p-2 hover:bg-blue-500/20 rounded-full transition-all"
              >
                <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="p-2 hover:bg-red-500/20 rounded-full transition-all"
              >
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <img src={playlist.cover} alt={playlist.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{playlist.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{playlist.description}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">{playlist.songs.length} songs</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPlaylist(playlist)}
                  className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddSong && (
        <Modal onClose={() => setShowAddSong(false)} title="Add New Song">
          <SongForm song={newSong} setSong={setNewSong} onSubmit={handleAddSong} />
        </Modal>
      )}

      {editingSong && (
        <Modal onClose={() => setEditingSong(null)} title="Edit Song">
          <SongForm song={editingSong} setSong={setEditingSong} onSubmit={handleUpdateSong} />
        </Modal>
      )}

      {showAddPlaylist && (
        <Modal onClose={() => setShowAddPlaylist(false)} title="Add New Playlist">
          <PlaylistForm 
            playlist={newPlaylist} 
            setPlaylist={setNewPlaylist} 
            onSubmit={handleAddPlaylist}
            songs={songs}
          />
        </Modal>
      )}

      {editingPlaylist && (
        <Modal onClose={() => setEditingPlaylist(null)} title="Edit Playlist">
          <PlaylistForm 
            playlist={editingPlaylist} 
            setPlaylist={setEditingPlaylist} 
            onSubmit={handleUpdatePlaylist}
            songs={songs}
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SongForm({ song, setSong, onSubmit }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Title *</label>
        <input
          type="text"
          value={song.title}
          onChange={(e) => setSong({ ...song, title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter song title"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Artist *</label>
        <input
          type="text"
          value={song.artist}
          onChange={(e) => setSong({ ...song, artist: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter artist name"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Album</label>
        <input
          type="text"
          value={song.album}
          onChange={(e) => setSong({ ...song, album: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter album name"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Genre</label>
        <input
          type="text"
          value={song.genre}
          onChange={(e) => setSong({ ...song, genre: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Pop, Rock, Jazz"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Duration</label>
        <input
          type="text"
          value={song.duration}
          onChange={(e) => setSong({ ...song, duration: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., 3:45"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Cover Image URL</label>
        <input
          type="text"
          value={song.cover}
          onChange={(e) => setSong({ ...song, cover: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://example.com/cover.jpg"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Audio URL</label>
        <input
          type="text"
          value={song.audio}
          onChange={(e) => setSong({ ...song, audio: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/audio.mp3"
        />
      </div>
      <button
        onClick={onSubmit}
  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
      >
        Save Song
      </button>
    </div>
  );
}

function PlaylistForm({ playlist, setPlaylist, onSubmit, songs }) {
  const toggleSong = (songId) => {
    setPlaylist({
      ...playlist,
      songs: playlist.songs.includes(songId)
        ? playlist.songs.filter(id => id !== songId)
        : [...playlist.songs, songId]
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Playlist Name *</label>
        <input
          type="text"
          value={playlist.name}
          onChange={(e) => setPlaylist({ ...playlist, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter playlist name"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Description</label>
        <input
          type="text"
          value={playlist.description}
          onChange={(e) => setPlaylist({ ...playlist, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter description"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Cover Image URL</label>
        <input
          type="text"
          value={playlist.cover}
          onChange={(e) => setPlaylist({ ...playlist, cover: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/cover.jpg"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Select Songs</label>
        <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-900">
          {songs.map(song => (
            <label
              key={song.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                checked={playlist.songs.includes(song.id)}
                onChange={() => toggleSong(song.id)}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
              />
              <img src={song.cover} alt={song.title} className="w-10 h-10 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{song.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{song.artist}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all"
      >
        Save Playlist
      </button>
    </div>
  );
}

function MusicPlayer({ 
  song, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  shuffle, 
  setShuffle, 
  repeat, 
  setRepeat, 
  progress, 
  duration, 
  onProgressChange, 
  isFavorite, 
  onToggleFavorite, 
  formatTime,
  darkMode 
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-t border-gray-200 dark:border-gray-700 p-4 z-40">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-6">
        <div className="flex items-center gap-4 flex-1">
          <img src={song.cover} alt={song.title} className="w-16 h-16 rounded-lg object-cover shadow-lg" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{song.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist}</p>
          </div>
          <button
            onClick={onToggleFavorite}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-2 rounded-full transition-all ${shuffle ? 'text-green-500 bg-green-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <SkipBack className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button
                    onClick={onPlayPause}
                    className="p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full transition-all shadow-lg"
                  >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </button>
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <SkipForward className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-2 rounded-full transition-all ${repeat ? 'text-green-500 bg-green-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xl">
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={onProgressChange}
              className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${(progress / duration) * 100}%, rgb(209 213 219) ${(progress / duration) * 100}%, rgb(209 213 219) 100%)`
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}

export default App;