package com.bookmarketplace.dto.response;

import com.bookmarketplace.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String avatar;
        private String location;
        private Double latitude;
        private Double longitude;
    }

    public static UserDto fromUser(User user) {
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .avatar(user.getAvatar())
            .location(user.getLocation())
            .latitude(user.getLatitude())
            .longitude(user.getLongitude())
            .build();
    }
}
