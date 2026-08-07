package com.saucerank.service;

import com.saucerank.dto.UserProfileResponse;
import com.saucerank.dto.UserSummaryResponse;
import com.saucerank.dto.VoteDetailResponse;
import com.saucerank.errors.ApiException;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
                .map(user -> new UserSummaryResponse(user.getId(), user.getUsername(), user.getEmail()))
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
                .map(user -> new UserSummaryResponse(user.getId(), user.getUsername(), user.getEmail()))
                .toList();
    }

    public UserProfileResponse getUserProfile(Long userId) {
        if (userId == null || userId <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "ID de usuario no válido");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return buildProfile(user);
    }

    public UserProfileResponse getUserProfileByUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El nombre de usuario es requerido");
        }
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return buildProfile(user);
    }

    private UserProfileResponse buildProfile(User user) {
        List<Vote> votes = voteRepository.findByUserId(user.getId());

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());

        List<VoteDetailResponse> voteDetails = new ArrayList<>();
        for (Vote vote : votes) {
            VoteDetailResponse vdr = new VoteDetailResponse();
            vdr.setSongId(vote.getSong().getId());
            vdr.setTitle(vote.getSong().getTitle());
            vdr.setFeaturedArtists(vote.getSong().getFeaturedArtists());
            vdr.setAlbumName(vote.getSong().getAlbum().getName());
            vdr.setSpotifyTrackId(vote.getSong().getSpotifyTrackId());
            vdr.setScore(vote.getScore());
            vdr.setVotedAt(vote.getCreatedAt().toString());
            voteDetails.add(vdr);
        }
        response.setVotes(voteDetails);
        return response;
    }
}
