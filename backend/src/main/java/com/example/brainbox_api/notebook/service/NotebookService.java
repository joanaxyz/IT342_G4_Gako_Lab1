package com.example.brainbox_api.notebook.service;

import org.springframework.stereotype.Service;

import com.example.brainbox_api.auth.entity.User;
import com.example.brainbox_api.auth.service.UserService;
import com.example.brainbox_api.notebook.repository.NotebookRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import com.example.brainbox_api.notebook.entity.Notebook;
import com.example.brainbox_api.notebook.entity.Category;
import com.example.brainbox_api.notebook.dto.request.NotebookRequest;
import com.example.brainbox_api.notebook.dto.response.NotebookResponse;
import com.example.brainbox_api.notebook.repository.CategoryRepository;

@Service
@RequiredArgsConstructor
public class NotebookService {
    private final NotebookRepository notebookRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public NotebookResponse createNotebook(NotebookRequest request, Long userId) {
        Notebook notebook = new Notebook();
        notebook.setTitle(request.getTitle());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            notebook.setCategory(category);
        }

        notebook.setUser(userService.findById(userId));
        return mapToResponse(notebookRepository.save(notebook));
    }

    public List<NotebookResponse> getAllNotebooks() {
        return notebookRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<NotebookResponse> getNotebooksByUser(User user) {
        return notebookRepository.findAll().stream()
                .filter(d -> d.getUser().getId().equals(user.getId()))
                .map(this::mapToResponse)
                .toList();
    }

    public NotebookResponse getNotebookResponseById(Long id) {
        return mapToResponse(getNotebookById(id));
    }

    public Notebook getNotebookById(Long id) {
        return notebookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));
    }

    public NotebookResponse updateNotebook(Long id, NotebookRequest request) {
        Notebook notebook = getNotebookById(id);
        if (request.getTitle() != null) {
            notebook.setTitle(request.getTitle());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            notebook.setCategory(category);
        }
        return mapToResponse(notebookRepository.save(notebook));
    }

    public void deleteNotebook(Long id) {
        notebookRepository.deleteById(id);
    }

    private NotebookResponse mapToResponse(Notebook notebook) {
        NotebookResponse response = new NotebookResponse();
        response.setId(notebook.getId());
        response.setTitle(notebook.getTitle());
        response.setCreatedAt(notebook.getCreatedAt());
        response.setUpdatedAt(notebook.getUpdatedAt());
        if (notebook.getCategory() != null) {
            response.setCategoryId(notebook.getCategory().getId());
            response.setCategoryName(notebook.getCategory().getName());
        }
        return response;
    }
}
