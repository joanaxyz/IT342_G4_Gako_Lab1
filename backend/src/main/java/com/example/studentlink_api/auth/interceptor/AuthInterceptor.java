package com.example.studentlink_api.auth.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.studentlink_api.auth.annotation.RequireAdminAuth;
import com.example.studentlink_api.auth.annotation.RequireAuth;
import com.example.studentlink_api.auth.entity.User;
import com.example.studentlink_api.auth.enumeration.UserRole;
import com.example.studentlink_api.auth.service.JWTService;
import com.example.studentlink_api.auth.service.UserService;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JWTService jwtService;
    private final UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RequireAuth requireAuth = handlerMethod.getMethodAnnotation(RequireAuth.class);
        RequireAdminAuth requireAdminAuth = handlerMethod.getMethodAnnotation(RequireAdminAuth.class);

        if (requireAuth == null && requireAdminAuth == null) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Missing or invalid Authorization header\"}");
            response.setContentType("application/json");
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or expired token\"}");
            response.setContentType("application/json");
            return false;
        }

        Long userId = jwtService.extractUserId(token);
        String userRole = jwtService.extractRole(token);

        User user = userService.findById(userId);

        if (requireAdminAuth != null && !UserRole.ADMIN.name().equals(userRole)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Admin access required\"}");
            response.setContentType("application/json");
            return false;
        }

        request.setAttribute("user", user);
        request.setAttribute("userId", userId);
        request.setAttribute("userRole", userRole);

        return true;
    }
}
