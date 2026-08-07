package com.saucerank.service;

import com.saucerank.dto.AlbumResponse;
import com.saucerank.dto.SongResponse;
import com.saucerank.model.Album;
import com.saucerank.model.Song;
import com.saucerank.model.Vote;
import com.saucerank.repository.AlbumRepository;
import com.saucerank.repository.SongRepository;
import com.saucerank.repository.VoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private SongRepository songRepository;

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private AlbumService albumService;

    private Album album(Long id) {
        Album album = new Album("Sauce Boyz", 2020, "/cover.png", "ALBUM");
        album.setId(id);
        return album;
    }

    private Song song(Long id, String title) {
        Song song = new Song(album(1L), title, 1, null, "spot");
        song.setId(id);
        return song;
    }

    @Test
    void getAlbumMapeaElAlbumYSusCanciones() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album(1L)));
        when(songRepository.findByAlbumIdOrderByTrackNumber(1L)).thenReturn(List.of(song(10L, "Kemba Walker")));

        List<Object[]> counts = new ArrayList<>();
        counts.add(new Object[]{10L, 3L});
        when(voteRepository.findVoteCountsByAlbumId(1L)).thenReturn(counts);

        AlbumResponse response = albumService.getAlbum(1L, null);

        assertEquals(1L, response.getId());
        assertEquals("Sauce Boyz", response.getName());
        assertEquals(2020, response.getYear());
        assertEquals("ALBUM", response.getType());
        assertEquals("/cover.png", response.getCoverUrl());
        assertEquals(1, response.getSongs().size());

        SongResponse sr = response.getSongs().get(0);
        assertEquals("Kemba Walker", sr.getTitle());
        assertEquals(3L, sr.getVoteCount());
        assertFalse(sr.isVotedByCurrentUser());
        assertEquals(0, sr.getUserScore());
    }

    @Test
    void getAlbumSinUsuarioNoConsultaVotosDeUsuario() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album(1L)));
        when(songRepository.findByAlbumIdOrderByTrackNumber(1L)).thenReturn(List.of(song(10L, "Kemba Walker")));
        when(voteRepository.findVoteCountsByAlbumId(1L)).thenReturn(List.of());

        albumService.getAlbum(1L, null);

        verify(voteRepository, never()).existsByUserIdAndSongId(any(), any());
        verify(voteRepository, never()).findByUserIdAndSongId(any(), any());
    }

    @Test
    void getAlbumConUsuarioMarcaVotadoYSuPuntaje() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album(1L)));
        when(songRepository.findByAlbumIdOrderByTrackNumber(1L)).thenReturn(List.of(song(10L, "Kemba Walker")));
        when(voteRepository.findVoteCountsByAlbumId(1L)).thenReturn(List.of());
        when(voteRepository.existsByUserIdAndSongId(5L, 10L)).thenReturn(true);

        Vote vote = new Vote();
        vote.setScore(8);
        when(voteRepository.findByUserIdAndSongId(5L, 10L)).thenReturn(Optional.of(vote));

        AlbumResponse response = albumService.getAlbum(1L, 5L);

        SongResponse sr = response.getSongs().get(0);
        assertTrue(sr.isVotedByCurrentUser());
        assertEquals(8, sr.getUserScore());
    }

    @Test
    void getAlbumLanzaSiNoExiste() {
        when(albumRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> albumService.getAlbum(99L, null));
    }

    @Test
    void getAlbumCalculaLaMediaYTotalesDelAlbum() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album(1L)));
        when(songRepository.findByAlbumIdOrderByTrackNumber(1L)).thenReturn(List.of(song(10L, "Kemba Walker")));
        when(voteRepository.findVoteCountsByAlbumId(1L)).thenReturn(List.of());

        List<Object[]> aggregate = new ArrayList<>();
        aggregate.add(new Object[]{12L, 8.75});
        when(voteRepository.findAlbumAggregate(1L)).thenReturn(aggregate);

        AlbumResponse response = albumService.getAlbum(1L, null);

        assertEquals(12L, response.getVoteCount());
        assertEquals(8.75, response.getAverageScore(), 0.001);
    }

    @Test
    void getAlbumSinVotosPoneMediaYCero() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album(1L)));
        when(songRepository.findByAlbumIdOrderByTrackNumber(1L)).thenReturn(List.of(song(10L, "Kemba Walker")));
        when(voteRepository.findVoteCountsByAlbumId(1L)).thenReturn(List.of());
        when(voteRepository.findAlbumAggregate(1L)).thenReturn(List.of());

        AlbumResponse response = albumService.getAlbum(1L, null);

        assertEquals(0L, response.getVoteCount());
        assertEquals(0.0, response.getAverageScore(), 0.001);
    }

    @Test
    void getAllAlbumsDevuelveOrdenadosPorAnioDesc() {
        Album a2020 = album(1L);
        Album a2018 = new Album("SAUCE BOYFRIEND", 2018, null, "ALBUM");
        a2018.setId(2L);
        when(albumRepository.findAllByOrderByYearDesc()).thenReturn(List.of(a2020, a2018));
        when(albumRepository.findById(1L)).thenReturn(Optional.of(a2020));
        when(albumRepository.findById(2L)).thenReturn(Optional.of(a2018));
        when(songRepository.findByAlbumIdOrderByTrackNumber(anyLong())).thenReturn(List.of());
        when(voteRepository.findVoteCountsByAlbumId(anyLong())).thenReturn(List.of());

        List<AlbumResponse> albums = albumService.getAllAlbumsWithSongs(null);

        assertEquals(2, albums.size());
        assertEquals(2020, albums.get(0).getYear());
        assertEquals(2018, albums.get(1).getYear());
    }
}
