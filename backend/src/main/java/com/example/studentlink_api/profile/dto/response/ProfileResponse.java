package com.example.studentlink_api.profile.dto.response;

import com.example.studentlink_api.auth.enumeration.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {
    String username, email;
    UserRole role;
}
