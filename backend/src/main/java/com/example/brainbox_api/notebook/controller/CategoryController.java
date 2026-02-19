package com.example.brainbox_api.notebook.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.brainbox_api.auth.annotation.RequireAuth;
import com.example.brainbox_api.notebook.dto.request.CategoryRequest;
import com.example.brainbox_api.notebook.dto.response.CategoryResponse;
import com.example.brainbox_api.notebook.service.CategoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/create")
    @RequireAuth
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest categoryRequest, @RequestAttribute Long userId) {
        return ResponseEntity.ok(categoryService.createCategory(categoryRequest, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryResponseById(id));
    }

    @RequireAuth
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
