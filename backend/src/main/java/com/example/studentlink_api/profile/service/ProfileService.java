package com.example.studentlink_api.profile.service;

import org.springframework.stereotype.Service;

import com.example.studentlink_api.auth.entity.User;
import com.example.studentlink_api.profile.dto.response.ProfileResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    public ProfileResponse getProfile(User user){
        ProfileResponse response = new ProfileResponse();
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        return response;
    }
}
