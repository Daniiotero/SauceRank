package com.saucerank.service;

import com.saucerank.dto.UserProfileResponse;
import com.saucerank.dto.UserSummaryResponse;
import com.saucerank.dto.VoteDetailResponse;
import com.saucerank.errors.ApiException;
import com.saucerank.model.Album;
import com.saucerank.model.Song;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private UserService userService;

    private User user() {
        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        return user;
    }

    private Vote voteFor(Song song) {
        Vote vote = new Vote(user(), song, 9);
        vote.setCreatedAt(LocalDateTime.of(2024, 1, 1, 10, 0));
        return vote;
    }

    @Test
    void getUserProfileConstruyeElPerfilConSusVotos() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user()));

        Album album = new Album("Sauce Boyz", 2020, null, "ALBUM");
        Song song = new Song(album, "Kemba Walker", 1, null, "spot");
        song.setId(10L);
        when(voteRepository.findByUserId(1L)).thenReturn(List.of(voteFor(song)));

        UserProfileResponse profile = userService.getUserProfile(1L, 1L);

        assertEquals("sauce", profile.getUsername());
        assertEquals("sauce@example.com", profile.getEmail());
        assertEquals(1, profile.getVotes().size());

        VoteDetailResponse vdr = profile.getVotes().get(0);
        assertEquals(10L, vdr.getSongId());
        assertEquals("Kemba Walker", vdr.getTitle());
        assertEquals("Sauce Boyz", vdr.getAlbumName());
        assertEquals(9, vdr.getScore());
        assertEquals("2024-01-01T10:00", vdr.getVotedAt());
    }

    @Test
    void getUserProfileOcultaElEmailParaOtrosUsuarios() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user()));
        when(voteRepository.findByUserId(1L)).thenReturn(List.of());

        UserProfileResponse profile = userService.getUserProfile(1L, 99L);

        assertEquals("sauce", profile.getUsername());
        assertEquals(null, profile.getEmail());
    }

    @Test
    void getUserProfileSinVotosDevuelveListaVacia() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user()));
        when(voteRepository.findByUserId(1L)).thenReturn(List.of());

        UserProfileResponse profile = userService.getUserProfile(1L, 1L);

        assertNotNull(profile.getVotes());
        assertTrue(profile.getVotes().isEmpty());
    }

    @Test
    void getUserProfileLanzaSiElUsuarioNoExiste() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserProfile(99L, 1L));
    }

    @Test
    void getUserProfileByUsernameBuscaPorNombre() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(user()));
        when(voteRepository.findByUserId(1L)).thenReturn(List.of());

        UserProfileResponse profile = userService.getUserProfileByUsername("sauce", 1L);

        assertEquals("sauce", profile.getUsername());
        assertEquals("sauce@example.com", profile.getEmail());
    }

    @Test
    void getAllUsersDevuelveTodosLosUsuariosOrdenados() {
        User other = new User("ana", "ana@example.com", "hashed");
        when(userRepository.findAllByOrderByUsernameAsc()).thenReturn(List.of(other, user()));

        List<UserSummaryResponse> users = userService.getAllUsers();

        assertEquals(2, users.size());
        assertEquals("ana", users.get(0).getUsername());
        assertEquals("sauce", users.get(1).getUsername());
        verify(userRepository).findAllByOrderByUsernameAsc();
    }

    @Test
    void searchUsersDelegaEnElRepositorio() {
        when(userRepository.searchByUsername("sau")).thenReturn(List.of(user()));

        List<UserSummaryResponse> users = userService.searchUsers("sau");

        assertEquals(1, users.size());
        assertEquals("sauce", users.get(0).getUsername());
        verify(userRepository).searchByUsername("sau");
    }

    @Test
    void searchUsersRecortaLaQuery() {
        when(userRepository.searchByUsername("sau")).thenReturn(List.of());

        userService.searchUsers("  sau  ");

        verify(userRepository).searchByUsername("sau");
    }

    @Test
    void searchUsersEscapaLosComodinesDelLike() {
        when(userRepository.searchByUsername("\\%sau\\_\\\\")).thenReturn(List.of());

        userService.searchUsers("%sau_\\");

        verify(userRepository).searchByUsername("\\%sau\\_\\\\");
    }

    @Test
    void searchUsersRechazaQueryVacia() {
        assertThrows(ApiException.class, () -> userService.searchUsers("   "));
        assertThrows(ApiException.class, () -> userService.searchUsers(null));
    }
}
