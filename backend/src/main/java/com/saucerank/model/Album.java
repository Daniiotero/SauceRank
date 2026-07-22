package com.saucerank.model;

import jakarta.persistence.*;

@Entity
@Table(name = "albums")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "spotify_playlist_id", length = 100)
    private String spotifyPlaylistId;

    public Album() {}

    public Album(String name, Integer year, String coverUrl, String type) {
        this.name = name;
        this.year = year;
        this.coverUrl = coverUrl;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSpotifyPlaylistId() { return spotifyPlaylistId; }
    public void setSpotifyPlaylistId(String spotifyPlaylistId) { this.spotifyPlaylistId = spotifyPlaylistId; }
}
