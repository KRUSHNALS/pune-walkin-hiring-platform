package com.punewalkin.platform.notification;

import com.punewalkin.platform.common.dto.ApiResponse;
import com.punewalkin.platform.common.exception.ResourceNotFoundException;
import com.punewalkin.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "User notification management")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    @Operation(summary = "Get current user's notifications")
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(
                principal.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", notifications));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationRepository.countByRecipientIdAndIsRead(principal.getId(), false);
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched", Map.of("count", count)));
    }

    @PatchMapping("/{notificationId}/read")
    @Transactional
    @Operation(summary = "Mark a specific notification as read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @PathVariable String notificationId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        if (!notification.getRecipient().getId().equals(principal.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        }
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    @PostMapping("/mark-all-read")
    @Transactional
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationRepository.markAllAsReadForUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}
