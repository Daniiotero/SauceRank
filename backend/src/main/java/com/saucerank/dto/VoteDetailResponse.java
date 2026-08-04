package com.saucerank.dto;

public class VoteDetailResponse {
    private Long songId;
    private String title;
    private String featuredArtists;
    private String albumName;
    private String spotifyTrackId;
    private Integer score;
    private String votedAt;

    public Long getSongId() { return songId; }
    public void setSongId(Long songId) { this.songId = songId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFeaturedArtists() { return featuredArtists; }
    public void setFeaturedArtists(String featuredArtists) { this.featuredArtists = featuredArtists; }
    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }
    public String getSpotifyTrackId() { return spotifyTrackId; }
    public void setSpotifyTrackId(String spotifyTrackId) { this.spotifyTrackId = spotifyTrackId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getVotedAt() { return votedAt; }
    public void setVotedAt(String votedAt) { this.votedAt = votedAt; }
}
