package com.saucerank.service;

import com.saucerank.dto.UserAlbumResponse;
import com.saucerank.dto.UserProfileResponse;
import com.saucerank.dto.UserSummaryResponse;
import com.saucerank.dto.VoteDetailResponse;
import com.saucerank.errors.ApiException;
import com.saucerank.model.Album;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private static final int MAX_SEARCH_LENGTH = 50;

    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    public UserService(UserRepository userRepository, VoteRepository voteRepository) {
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAllByOrderByUsernameAsc().stream()
                .map(user -> new UserSummaryResponse(user.getId(), user.getUsername()))
                .toList();
    }

    public List<UserSummaryResponse> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El término de búsqueda no puede estar vacío");
        }
        String trimmed = query.trim();
        if (trimmed.length() > MAX_SEARCH_LENGTH) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El término de búsqueda es demasiado largo");
        }
        String escaped = trimmed
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return userRepository.searchByUsername(escaped).stream()
                .map(user -> new UserSummaryResponse(user.getId(), user.getUsername()))
                .toList();
    }

    public UserProfileResponse getUserProfile(Long userId, Long currentUserId) {
        if (userId == null || userId <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "ID de usuario no válido");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return buildProfile(user, currentUserId);
    }

    public UserProfileResponse getUserProfileByUsername(String username, Long currentUserId) {
        if (username == null || username.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El nombre de usuario es requerido");
        }
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return buildProfile(user, currentUserId);
    }

    private UserProfileResponse buildProfile(User user, Long currentUserId) {
        List<Vote> votes = voteRepository.findByUserId(user.getId());

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        if (currentUserId != null && currentUserId.equals(user.getId())) {
            response.setEmail(user.getEmail());
        }

        Map<Long, UserAlbumResponse> albumsById = new LinkedHashMap<>();
        for (Vote vote : votes) {
            Album album = vote.getSong().getAlbum();
            UserAlbumResponse albumRes = albumsById.computeIfAbsent(album.getId(), id -> {
                UserAlbumResponse uar = new UserAlbumResponse();
                uar.setAlbumId(album.getId());
                uar.setAlbumName(album.getName());
                uar.setAlbumYear(album.getYear());
                uar.setCoverUrl(album.getCoverUrl());
                uar.setSongs(new ArrayList<>());
                return uar;
            });

            VoteDetailResponse vdr = new VoteDetailResponse();
            vdr.setSongId(vote.getSong().getId());
            vdr.setTitle(vote.getSong().getTitle());
            vdr.setFeaturedArtists(vote.getSong().getFeaturedArtists());
            vdr.setAlbumName(album.getName());
            vdr.setSpotifyTrackId(vote.getSong().getSpotifyTrackId());
            vdr.setTrackNumber(vote.getSong().getTrackNumber());
            vdr.setScore(vote.getScore());
            vdr.setVotedAt(vote.getCreatedAt().toString());
            albumRes.getSongs().add(vdr);
        }

        List<UserAlbumResponse> albums = new ArrayList<>(albumsById.values());
        albums.sort(Comparator.comparingInt((UserAlbumResponse a) -> a.getAlbumYear()).reversed());
        for (UserAlbumResponse uar : albums) {
            uar.getSongs().sort(Comparator.comparingInt(VoteDetailResponse::getTrackNumber));
        }
        response.setAlbums(albums);
        return response;
    }
}
