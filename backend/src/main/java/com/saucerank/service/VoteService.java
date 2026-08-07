package com.saucerank.service;

import com.saucerank.dto.TopSongResponse;
import com.saucerank.errors.ApiException;
import com.saucerank.model.Song;
import com.saucerank.model.User;
import com.saucerank.model.Vote;
import com.saucerank.repository.SongRepository;
import com.saucerank.repository.UserRepository;
import com.saucerank.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VoteService {

    private static final int MIN_SCORE = 1;
    private static final int MAX_SCORE = 10;

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
        requirePositiveId(userId, "userId");
        requirePositiveId(songId, "songId");
        if (score < MIN_SCORE || score > MAX_SCORE) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La puntuación debe estar entre 1 y 10");
        }

        Optional<Vote> existing = voteRepository.findByUserIdAndSongId(userId, songId);
        if (existing.isPresent()) {
            Vote vote = existing.get();
            vote.setScore(score);
            voteRepository.save(vote);
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Song not found"));

        voteRepository.save(new Vote(user, song, score));
    }

    @Transactional
    public void unvote(Long userId, Long songId) {
        requirePositiveId(userId, "userId");
        requirePositiveId(songId, "songId");
        voteRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public boolean hasVoted(Long userId, Long songId) {
        requirePositiveId(userId, "userId");
        requirePositiveId(songId, "songId");
        return voteRepository.existsByUserIdAndSongId(userId, songId);
    }

    public int getUserScore(Long userId, Long songId) {
        requirePositiveId(userId, "userId");
        requirePositiveId(songId, "songId");
        return voteRepository.findByUserIdAndSongId(userId, songId)
                .map(Vote::getScore)
                .orElse(0);
    }

    private void requirePositiveId(Long id, String name) {
        if (id == null || id <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, name + " no válido");
        }
    }

    public List<TopSongResponse> getTopSongs(int limit) {
        List<Object[]> topVotes = voteRepository.findTopVotedSongs();
        List<TopSongResponse> result = new ArrayList<>();
        int rank = 1;

        for (Object[] row : topVotes) {
            if (rank > limit) break;
            Long songId = (Long) row[0];
            Long count = (Long) row[1];
            double avgScore = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;

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
                    avgScore,
                    rank
            ));
            rank++;
        }

        return result;
    }
}
