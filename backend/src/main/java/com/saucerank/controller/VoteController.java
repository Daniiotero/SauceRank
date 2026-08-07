package com.saucerank.controller;

import com.saucerank.dto.TopAlbumResponse;
import com.saucerank.dto.TopSongResponse;
import com.saucerank.dto.VoteRequest;
import com.saucerank.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    public ResponseEntity<?> vote(@Valid @RequestBody VoteRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        voteService.vote(userId, request.getSongId(), request.getScore());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<?> unvote(@PathVariable Long songId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        voteService.unvote(userId, songId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top")
    public ResponseEntity<List<TopSongResponse>> getTop() {
        return ResponseEntity.ok(voteService.getTopSongs(20));
    }

    @GetMapping("/top-albums")
    public ResponseEntity<List<TopAlbumResponse>> getTopAlbums() {
        return ResponseEntity.ok(voteService.getTopAlbums(20));
    }

    @GetMapping("/check/{songId}")
    public ResponseEntity<Boolean> checkVote(@PathVariable Long songId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(voteService.hasVoted(userId, songId));
    }

    @GetMapping("/score/{songId}")
    public ResponseEntity<Integer> getScore(@PathVariable Long songId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(voteService.getUserScore(userId, songId));
    }
}
