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
    public void vote(Long userId, Long songId) {
        if (voteRepository.existsByUserIdAndSongId(userId, songId)) {
            throw new RuntimeException("Already voted for this song");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        voteRepository.save(new Vote(user, song));
    }

    @Transactional
    public void unvote(Long userId, Long songId) {
        voteRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public boolean hasVoted(Long userId, Long songId) {
        return voteRepository.existsByUserIdAndSongId(userId, songId);
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
