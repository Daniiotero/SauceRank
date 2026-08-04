package com.saucerank.dto;

public class TopSongResponse {
    private Long songId;
    private String title;
    private String featuredArtists;
    private String albumName;
    private Integer albumYear;
    private String spotifyTrackId;
    private long voteCount;
    private double averageScore;
    private int rank;

    public TopSongResponse(Long songId, String title, String featuredArtists,
                           String albumName, Integer albumYear, String spotifyTrackId,
                           long voteCount, double averageScore, int rank) {
        this.songId = songId;
        this.title = title;
        this.featuredArtists = featuredArtists;
        this.albumName = albumName;
        this.albumYear = albumYear;
        this.spotifyTrackId = spotifyTrackId;
        this.voteCount = voteCount;
        this.averageScore = averageScore;
        this.rank = rank;
    }

    public Long getSongId() { return songId; }
    public void setSongId(Long songId) { this.songId = songId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFeaturedArtists() { return featuredArtists; }
    public void setFeaturedArtists(String featuredArtists) { this.featuredArtists = featuredArtists; }
    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }
    public Integer getAlbumYear() { return albumYear; }
    public void setAlbumYear(Integer albumYear) { this.albumYear = albumYear; }
    public String getSpotifyTrackId() { return spotifyTrackId; }
    public void setSpotifyTrackId(String spotifyTrackId) { this.spotifyTrackId = spotifyTrackId; }
    public long getVoteCount() { return voteCount; }
    public void setVoteCount(long voteCount) { this.voteCount = voteCount; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
