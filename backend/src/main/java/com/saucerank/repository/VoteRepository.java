package com.saucerank.repository;

import com.saucerank.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserIdAndSongId(Long userId, Long songId);
    boolean existsByUserIdAndSongId(Long userId, Long songId);
    void deleteByUserIdAndSongId(Long userId, Long songId);
    long countBySongId(Long songId);

    @Query("SELECT v.song.id, COUNT(v) as cnt, AVG(v.score) as avgScore " +
           "FROM Vote v GROUP BY v.song.id ORDER BY AVG(v.score) DESC, COUNT(v) DESC")
    List<Object[]> findTopVotedSongs();

    @Query("SELECT v.song.id, COUNT(v) as cnt FROM Vote v WHERE v.song.album.id = :albumId GROUP BY v.song.id ORDER BY cnt DESC")
    List<Object[]> findVoteCountsByAlbumId(@Param("albumId") Long albumId);

    List<Vote> findByUserId(Long userId);
}
