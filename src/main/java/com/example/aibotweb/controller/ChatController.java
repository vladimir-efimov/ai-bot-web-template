package com.example.aibotweb.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "*")
public class ChatController {

    // keep state for each chat
    private final List<Integer> states = new ArrayList<>();

    @PostMapping
    public Map<String, Object> initializeChat() {
        Map<String, Object> response = new HashMap<>();
        int chatId;
        synchronized (this) {
            states.add(0);
            chatId = states.size();
        }
        response.put("chatId", chatId);
        return response;
    }

    @PutMapping(value = "/{id}")
    public Map<String, Object> handleButtonClick(@PathVariable("id") int chatId,
                                                 @RequestBody Map<String, String> request) {
        String buttonName = request.get("buttonName");
        int index = chatId - 1;
        Map<String, Object> response = new HashMap<>();
        if (index < 0 || index >= states.size()) {
            response.put("message", "Entity with ID " + chatId + " not found");
            return response;
        }

        int state = states.get(index);
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
            response.put("buttons", List.of("Начать диалог заново"));
            state = 0;
        }
        states.set(index, state);
        return response;
    }
}
