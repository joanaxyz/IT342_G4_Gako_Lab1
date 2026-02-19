package com.example.brainbox_api.notebook.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.brainbox_api.auth.annotation.RequireAuth;
import com.example.brainbox_api.notebook.dto.request.ReorderRequest;
import com.example.brainbox_api.notebook.dto.request.SectionOrderRequest;
import com.example.brainbox_api.notebook.dto.request.SectionRequest;
import com.example.brainbox_api.notebook.dto.response.SectionResponse;
import com.example.brainbox_api.notebook.service.SectionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sections")
@RequiredArgsConstructor
public class SectionController {
    private final SectionService sectionService;

    @PostMapping("/create")
    @RequireAuth
    public ResponseEntity<SectionResponse> createSection(@RequestBody SectionRequest sectionRequest) {
        return ResponseEntity.ok(sectionService.createSection(sectionRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionResponse> getSection(@PathVariable Long id) {
        return ResponseEntity.ok(sectionService.getSectionResponseById(id));
    }

    @GetMapping("/notebook/{notebookId}")
    public ResponseEntity<List<SectionResponse>> getSectionsByNotebook(@PathVariable Long notebookId) {
        return ResponseEntity.ok(sectionService.getSectionsByNotebookId(notebookId));
    }

    @RequireAuth
    @PutMapping("/update/{id}")
    public ResponseEntity<SectionResponse> updateSection(@PathVariable Long id, @RequestBody SectionRequest sectionRequest) {
        return ResponseEntity.ok(sectionService.updateSection(id, sectionRequest));
    }

    @RequireAuth
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }

    @RequireAuth
    @PostMapping("/reorder")
    public ResponseEntity<Void> reorderSections(@RequestBody ReorderRequest reorderRequest) {
        sectionService.reorderSections(reorderRequest);
        return ResponseEntity.ok().build();
    }

    @RequireAuth
    @PostMapping("/bulk-reorder")
    public ResponseEntity<Void> updateSectionOrder(@RequestBody List<SectionOrderRequest> requests) {
        sectionService.updateSectionOrder(requests);
        return ResponseEntity.ok().build();
    }
}
