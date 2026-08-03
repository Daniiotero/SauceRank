package com.saucerank.service;

import com.saucerank.dto.TopSongResponse;
import com.saucerank.model.Song;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.SongRepository;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public VoteService(VoteRepository voteRepository, SongRepository songRepository,
                       UserRepository userRepository) {
        this.voteRepository = voteRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void vote(Long userId, Long songId, int score) {
        Optional<Vote> existing = voteRepository.findByUserIdAndSongId(userId, songId);
        if (existing.isPresent()) {
            Vote vote = existing.get();
            vote.setScore(score);
            voteRepository.save(vote);
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        voteRepository.save(new Vote(user, song, score));
    }

    @Transactional
    public void unvote(Long userId, Long songId) {
        voteRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public boolean hasVoted(Long userId, Long songId) {
        return voteRepository.existsByUserIdAndSongId(userId, songId);
    }

    public int getUserScore(Long userId, Long songId) {
        return voteRepository.findByUserIdAndSongId(userId, songId)
                .map(Vote::getScore)
                .orElse(0);
    }

    public List<TopSongResponse> getTopSongs(int limit) {
        List<Object[]> topVotes = voteRepository.findTopVotedSongs();
        List<TopSongResponse> result = new ArrayList<>();
        int rank = 1;

        for (Object[] row : topVotes) {
            if (rank > limit) break;
            Long songId = (Long) row[0];
            Long count = (Long) row[1];

            Song song = songRepository.findById(songId).orElse(null);
            if (song == null) continue;

            result.add(new TopSongResponse(
                    songId,
                    song.getTitle(),
                    song.getFeaturedArtists(),
                    song.getAlbum().getName(),
                    song.getAlbum().getYear(),
                    song.getSpotifyTrackId(),
                    count,
                    rank
            ));
            rank++;
        }

        return result;
    }
}
