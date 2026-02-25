package com.example.aibotweb.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private int state = -1;

    @PostMapping
    public Map<String, Object> initializeChat() {
        Map<String, Object> response = new HashMap<>();
        state = 0;
        return response;
    }

    @PutMapping
    public Map<String, Object> handleButtonClick(@RequestBody Map<String, String> request) {
        String buttonName = request.get("buttonName");
        Map<String, Object> response = new HashMap<>();

        if (state == 0) {
            response.put("message", "Привет! Нажми на кнопку.");
            response.put("buttons", Arrays.asList("1А", "1Б"));
            state++;
        } else if (state == 1) {
            response.put("message", "Спасибо за ваш выбор");
            var buttons = "1А".equals(buttonName) ? Arrays.asList("1А2A", "1A2Б") : Arrays.asList("1B2A", "1B2Б");
            response.put("buttons", buttons);
            state++;
        } else {
            response.put("message", "Спасибо за ваш выбор. Диалог окончен");
        }
        return response;
    }
}
