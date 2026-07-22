package com.saucerank.dto;

import java.util.List;

public class AlbumResponse {
    private Long id;
    private String name;
    private Integer year;
    private String coverUrl;
    private String type;
    private String spotifyPlaylistId;
    private List<SongResponse> songs;

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
    public List<SongResponse> getSongs() { return songs; }
    public void setSongs(List<SongResponse> songs) { this.songs = songs; }
}
