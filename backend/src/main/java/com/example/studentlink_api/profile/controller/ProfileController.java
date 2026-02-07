package com.example.studentlink_api.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentlink_api.auth.annotation.RequireAuth;
import com.example.studentlink_api.auth.entity.User;
import com.example.studentlink_api.profile.dto.response.ProfileResponse;
import com.example.studentlink_api.profile.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    @RequireAuth
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(@RequestAttribute User user) {
        return ResponseEntity.ok(profileService.getProfile(user));
    }
}
