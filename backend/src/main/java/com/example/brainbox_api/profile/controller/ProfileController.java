package com.example.brainbox_api.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.brainbox_api.auth.annotation.RequireAuth;
import com.example.brainbox_api.profile.dto.response.ProfileResponse;
import com.example.brainbox_api.profile.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    @RequireAuth
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }
}
