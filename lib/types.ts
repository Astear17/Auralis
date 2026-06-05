export type SourceMode = "mock" | "youtube" | "local";

export type Artwork = {
  primary: string;
  secondary: string;
  accent: string;
  imageUrl?: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  source: SourceMode;
  artwork: Artwork;
  genres: string[];
  year: number;
  explicit?: boolean;
  youtubeVideoId?: string;
  localBlobId?: string;
  lyricsId?: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  artwork: Artwork;
  year: number;
  genres: string[];
  trackIds: string[];
  description: string;
};

export type Artist = {
  id: string;
  name: string;
  artwork: Artwork;
  genres: string[];
  monthlyListeners: string;
  bio: string;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  artwork: Artwork;
  trackIds: string[];
  tags: string[];
  owner: string;
};

export type LyricLine = {
  id: string;
  time: number;
  text: string;
};

export type LyricDocument = {
  trackId: string;
  plainText: string;
  lrc: string;
  offset: number;
  lines: LyricLine[];
};

export type SearchResults = {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
};
