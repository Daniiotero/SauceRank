package com.saucerank.service;

import com.saucerank.dto.AlbumResponse;
import com.saucerank.dto.SongResponse;
import com.saucerank.model.Album;
import com.saucerank.model.Song;
import com.saucerank.model.Vote;
import com.saucerank.repository.AlbumRepository;
import com.saucerank.repository.SongRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final VoteRepository voteRepository;

    public AlbumService(AlbumRepository albumRepository, SongRepository songRepository,
                        VoteRepository voteRepository) {
        this.albumRepository = albumRepository;
        this.songRepository = songRepository;
        this.voteRepository = voteRepository;
    }

    public List<Album> getAllAlbums() {
        return albumRepository.findAllByOrderByYearDesc();
    }

    public AlbumResponse getAlbum(Long albumId, Long currentUserId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        List<Song> songs = songRepository.findByAlbumIdOrderByTrackNumber(albumId);

        Map<Long, Long> voteCounts = new HashMap<>();
        List<Object[]> voteData = voteRepository.findVoteCountsByAlbumId(albumId);
        for (Object[] row : voteData) {
            voteCounts.put((Long) row[0], (Long) row[1]);
        }

        AlbumResponse response = new AlbumResponse();
        response.setId(album.getId());
        response.setName(album.getName());
        response.setYear(album.getYear());
        response.setCoverUrl(album.getCoverUrl());
        response.setType(album.getType());
        response.setSpotifyPlaylistId(album.getSpotifyPlaylistId());

        List<SongResponse> songResponses = new ArrayList<>();
        for (Song song : songs) {
            SongResponse sr = new SongResponse();
            sr.setId(song.getId());
            sr.setTitle(song.getTitle());
            sr.setTrackNumber(song.getTrackNumber());
            sr.setFeaturedArtists(song.getFeaturedArtists());
            sr.setSpotifyTrackId(song.getSpotifyTrackId());
            sr.setVoteCount(voteCounts.getOrDefault(song.getId(), 0L));
            sr.setVotedByCurrentUser(currentUserId != null &&
                    voteRepository.existsByUserIdAndSongId(currentUserId, song.getId()));
            songResponses.add(sr);
        }
        response.setSongs(songResponses);
        return response;
    }

    public List<AlbumResponse> getAllAlbumsWithSongs(Long currentUserId) {
        List<Album> albums = getAllAlbums();
        List<AlbumResponse> result = new ArrayList<>();
        for (Album album : albums) {
            result.add(getAlbum(album.getId(), currentUserId));
        }
        return result;
    }
}
