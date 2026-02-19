package com.example.brainbox_api.notebook.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.brainbox_api.notebook.service.NotebookService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.brainbox_api.auth.annotation.RequireAuth;
import com.example.brainbox_api.notebook.dto.request.NotebookRequest;
import com.example.brainbox_api.notebook.dto.response.NotebookResponse;

@RestController
@RequestMapping("/api/notebooks")
@RequiredArgsConstructor
public class NotebookController {
    private final NotebookService notebookService;

    @RequireAuth
    @PostMapping("/create")
    public ResponseEntity<NotebookResponse> createNotebook(@RequestBody NotebookRequest notebookRequest, @RequestAttribute Long userId) {
        return ResponseEntity.ok(notebookService.createNotebook(notebookRequest, userId));
    }
    
    @GetMapping()
    public ResponseEntity<List<NotebookResponse>> getNotebooks() {
        return ResponseEntity.ok(notebookService.getAllNotebooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotebookResponse> getNotebook(@PathVariable Long id) {
        return ResponseEntity.ok(notebookService.getNotebookResponseById(id));
    }

    @RequireAuth
    @PutMapping("/update/{id}")
    public ResponseEntity<NotebookResponse> updateNotebook(@PathVariable Long id, @RequestBody NotebookRequest notebookRequest) {
        return ResponseEntity.ok(notebookService.updateNotebook(id, notebookRequest));
    }

    @RequireAuth
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNotebook(@PathVariable Long id) {
        notebookService.deleteNotebook(id);
        return ResponseEntity.noContent().build();
    }
}
