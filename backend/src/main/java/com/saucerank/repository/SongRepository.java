package com.saucerank.repository;

import com.saucerank.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByAlbumIdOrderByTrackNumber(Long albumId);
}
