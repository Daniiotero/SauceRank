package com.saucerank.service;

import com.saucerank.dto.TopSongResponse;
import com.saucerank.errors.ApiException;
import com.saucerank.model.Album;
import com.saucerank.model.Song;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.SongRepository;
import com.saucerank.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private SongRepository songRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VoteService voteService;

    @Test
    void voteCreaUnVotoNuevo() {
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.empty());

        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        Song song = new Song();
        song.setId(2L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(songRepository.findById(2L)).thenReturn(Optional.of(song));

        voteService.vote(1L, 2L, 8);

        verify(voteRepository).save(argThat(v ->
                v.getScore() == 8 && v.getUser() == user && v.getSong() == song));
    }

    @Test
    void voteActualizaUnVotoExistente() {
        Vote existing = new Vote();
        existing.setScore(3);
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.of(existing));

        voteService.vote(1L, 2L, 9);

        assertEquals(9, existing.getScore());
        verify(voteRepository).save(existing);
        verify(userRepository, never()).findById(any());
    }

    @Test
    void voteLanzaSiElUsuarioNoExiste() {
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> voteService.vote(1L, 2L, 5));
    }

    @Test
    void voteLanzaSiLaCancionNoExiste() {
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.empty());
        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(songRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> voteService.vote(1L, 2L, 5));
    }

    @Test
    void unvoteBorraElVoto() {
        voteService.unvote(1L, 2L);
        verify(voteRepository).deleteByUserIdAndSongId(1L, 2L);
    }

    @Test
    void hasVotedDelegaEnElRepositorio() {
        when(voteRepository.existsByUserIdAndSongId(1L, 2L)).thenReturn(true);
        when(voteRepository.existsByUserIdAndSongId(1L, 3L)).thenReturn(false);

        assertTrue(voteService.hasVoted(1L, 2L));
        assertFalse(voteService.hasVoted(1L, 3L));
    }

    @Test
    void voteRechazaScoreFueraDeRango() {
        assertThrows(ApiException.class, () -> voteService.vote(1L, 2L, 0));
        assertThrows(ApiException.class, () -> voteService.vote(1L, 2L, 11));
    }

    @Test
    void voteRechazaIdsInvalidos() {
        assertThrows(ApiException.class, () -> voteService.vote(null, 2L, 5));
        assertThrows(ApiException.class, () -> voteService.vote(1L, -3L, 5));
        assertThrows(ApiException.class, () -> voteService.vote(0L, 2L, 5));
    }

    @Test
    void unvoteRechazaSongIdInvalido() {
        assertThrows(ApiException.class, () -> voteService.unvote(1L, -1L));
    }

    @Test
    void getUserScoreDevuelveCeroSinVoto() {
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.empty());

        assertEquals(0, voteService.getUserScore(1L, 2L));
    }

    @Test
    void getUserScoreDevuelveElPuntajeDelVoto() {
        Vote vote = new Vote();
        vote.setScore(7);
        when(voteRepository.findByUserIdAndSongId(1L, 2L)).thenReturn(Optional.of(vote));

        assertEquals(7, voteService.getUserScore(1L, 2L));
    }

    @Test
    void getTopSongsAsignaRankYRespetaElLimite() {
        List<Object[]> rows = new ArrayList<>();
        rows.add(new Object[]{10L, 5L, 9.2});
        rows.add(new Object[]{11L, 3L, 8.0});
        rows.add(new Object[]{12L, 1L, 7.5});
        when(voteRepository.findTopVotedSongs()).thenReturn(rows);

        Album album = new Album("Sauce Boyz", 2020, null, "ALBUM");
        Song s10 = new Song(album, "Kemba Walker", 1, null, "spot10");
        s10.setId(10L);
        Song s11 = new Song(album, "Mbappe", 2, "Future", "spot11");
        s11.setId(11L);
        when(songRepository.findById(10L)).thenReturn(Optional.of(s10));
        when(songRepository.findById(11L)).thenReturn(Optional.of(s11));

        List<TopSongResponse> top = voteService.getTopSongs(2);

        assertEquals(2, top.size());
        assertEquals(1, top.get(0).getRank());
        assertEquals(10L, top.get(0).getSongId());
        assertEquals("Kemba Walker", top.get(0).getTitle());
        assertEquals(9.2, top.get(0).getAverageScore(), 0.001);
        assertEquals(5L, top.get(0).getVoteCount());

        assertEquals(2, top.get(1).getRank());
        assertEquals("Sauce Boyz", top.get(1).getAlbumName());
        assertEquals(2020, top.get(1).getAlbumYear());
        assertEquals("Future", top.get(1).getFeaturedArtists());
    }

    @Test
    void getTopSongsSaltaCancionesQueNoExisten() {
        List<Object[]> rows = new ArrayList<>();
        rows.add(new Object[]{10L, 5L, 9.2});
        when(voteRepository.findTopVotedSongs()).thenReturn(rows);
        when(songRepository.findById(10L)).thenReturn(Optional.empty());

        List<TopSongResponse> top = voteService.getTopSongs(20);

        assertTrue(top.isEmpty());
    }

    @Test
    void getTopSongsManejaMediaNula() {
        List<Object[]> rows = new ArrayList<>();
        rows.add(new Object[]{10L, 2L, null});
        when(voteRepository.findTopVotedSongs()).thenReturn(rows);

        Album album = new Album("Sauce Boyz", 2020, null, "ALBUM");
        Song s10 = new Song(album, "Kemba Walker", 1, null, null);
        s10.setId(10L);
        when(songRepository.findById(10L)).thenReturn(Optional.of(s10));

        List<TopSongResponse> top = voteService.getTopSongs(20);

        assertEquals(1, top.size());
        assertEquals(1, top.get(0).getRank());
        assertEquals(0.0, top.get(0).getAverageScore(), 0.001);
    }
}
