package com.saucerank.service;

import com.saucerank.dto.UserProfileResponse;
import com.saucerank.dto.VoteDetailResponse;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    public UserService(UserRepository userRepository, VoteRepository voteRepository) {
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Vote> votes = voteRepository.findByUserId(userId);

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
            vdr.setVotedAt(vote.getCreatedAt().toString());
            voteDetails.add(vdr);
        }
        response.setVotes(voteDetails);
        return response;
    }
}
