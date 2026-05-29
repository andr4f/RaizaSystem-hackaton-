package com.raiza.demo.chat.api;

import com.raiza.demo.chat.dto.ChatRequest;
import com.raiza.demo.chat.dto.ChatResponse;
import com.raiza.demo.chat.service.ChatService;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> ask(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.ask(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
