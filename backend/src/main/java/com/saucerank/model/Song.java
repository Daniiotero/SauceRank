package com.saucerank.model;

import jakarta.persistence.*;

@Entity
@Table(name = "songs", uniqueConstraints = @UniqueConstraint(columnNames = {"album_id", "title"}))
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @Column(nullable = false)
    private String title;

    @Column(name = "track_number", nullable = false)
    private Integer trackNumber;

    @Column(name = "featured_artists", length = 300)
    private String featuredArtists;

    @Column(name = "spotify_track_id", length = 100)
    private String spotifyTrackId;

    public Song() {}

    public Song(Album album, String title, Integer trackNumber, String featuredArtists, String spotifyTrackId) {
        this.album = album;
        this.title = title;
        this.trackNumber = trackNumber;
        this.featuredArtists = featuredArtists;
        this.spotifyTrackId = spotifyTrackId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Album getAlbum() { return album; }
    public void setAlbum(Album album) { this.album = album; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getTrackNumber() { return trackNumber; }
    public void setTrackNumber(Integer trackNumber) { this.trackNumber = trackNumber; }
    public String getFeaturedArtists() { return featuredArtists; }
    public void setFeaturedArtists(String featuredArtists) { this.featuredArtists = featuredArtists; }
    public String getSpotifyTrackId() { return spotifyTrackId; }
    public void setSpotifyTrackId(String spotifyTrackId) { this.spotifyTrackId = spotifyTrackId; }
}
