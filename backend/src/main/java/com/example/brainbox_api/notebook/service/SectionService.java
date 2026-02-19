package com.example.brainbox_api.notebook.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.brainbox_api.notebook.dto.request.ReorderRequest;
import com.example.brainbox_api.notebook.dto.request.SectionOrderRequest;
import com.example.brainbox_api.notebook.dto.request.SectionRequest;
import com.example.brainbox_api.notebook.dto.response.SectionResponse;
import com.example.brainbox_api.notebook.entity.Section;
import com.example.brainbox_api.notebook.repository.NotebookRepository;
import com.example.brainbox_api.notebook.repository.SectionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectionService {
    private final SectionRepository sectionRepository;
    private final NotebookRepository notebookRepository;

    public SectionResponse createSection(SectionRequest request) {
        Section section = new Section();
        section.setTitle(request.getTitle());
        section.setContent(request.getContent());
        section.setOrderIndex(request.getOrderIndex());
        
        if (request.getNotebookId() != null) {
            section.setNotebook(notebookRepository.findById(request.getNotebookId())
                .orElseThrow(() -> new RuntimeException("Notebook not found")));
        }
        
        if (request.getParentSectionId() != null) {
            section.setParentSection(sectionRepository.findById(request.getParentSectionId())
                .orElseThrow(() -> new RuntimeException("Parent section not found")));
        }

        return mapToResponse(sectionRepository.save(section));
    }

    public SectionResponse getSectionResponseById(Long id) {
        return mapToResponse(getSectionById(id));
    }

    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Section not found"));
    }

    public List<SectionResponse> getSectionsByNotebookId(Long notebookId) {
        return sectionRepository.findAll().stream()
            .filter(s -> s.getNotebook() != null && s.getNotebook().getId().equals(notebookId))
            .filter(s -> s.getParentSection() == null)
            .sorted(java.util.Comparator.comparing(Section::getOrderIndex, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
            .map(this::mapToResponse)
            .toList();
    }

    public SectionResponse updateSection(Long sectionId, SectionRequest request){
        Section section = getSectionById(sectionId);
        if (request.getTitle() != null){
            section.setTitle(request.getTitle());
        }
        if (request.getContent() != null){
            section.setContent(request.getContent());
        }
        if (request.getOrderIndex() != null){
            section.setOrderIndex(request.getOrderIndex());
        }
        if(request.getParentSectionId() != null){
            Section parentSection = getSectionById(request.getParentSectionId());
            section.setParentSection(parentSection);
        }
        return mapToResponse(sectionRepository.save(section));
    }

    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }

    public void reorderSections(ReorderRequest request) {
        Section dragged = getSectionById(request.getDraggedId());
        Section target = getSectionById(request.getTargetId());

        Section newParent = target.getParentSection();
        List<Section> siblings;

        if (newParent == null) {
            siblings = new java.util.ArrayList<>(
                sectionRepository.findByNotebookIdAndParentSectionIsNullOrderByOrderIndexAsc(dragged.getNotebook().getId())
            );
        } else {
            siblings = new java.util.ArrayList<>(
                sectionRepository.findByParentSectionIdOrderByOrderIndexAsc(newParent.getId())
            );
        }

        // Remove dragged from current siblings if it's there
        siblings.removeIf(s -> s.getId().equals(dragged.getId()));

        // Find target's index
        int targetIdx = -1;
        for (int i = 0; i < siblings.size(); i++) {
            if (siblings.get(i).getId().equals(target.getId())) {
                targetIdx = i;
                break;
            }
        }

        if (targetIdx != -1) {
            siblings.add(targetIdx + 1, dragged);
        } else {
            siblings.add(dragged);
        }

        // Update indices for all siblings in this level
        for (int i = 0; i < siblings.size(); i++) {
            Section s = siblings.get(i);
            s.setOrderIndex(i);
            if (s.getId().equals(dragged.getId())) {
                s.setParentSection(newParent);
            }
            sectionRepository.save(s);
        }
    }

    public void updateSectionOrder(List<SectionOrderRequest> requests) {
        for (SectionOrderRequest req : requests) {
            Section section = getSectionById(req.getId());
            section.setOrderIndex(req.getOrderIndex());
            if (req.getParentSectionId() != null) {
                section.setParentSection(getSectionById(req.getParentSectionId()));
            } else {
                section.setParentSection(null);
            }
            sectionRepository.save(section);
        }
    }

    public SectionResponse mapToResponse(Section section) {
        SectionResponse response = new SectionResponse();
        response.setId(section.getId());
        response.setTitle(section.getTitle());
        response.setContent(section.getContent());
        response.setOrderIndex(section.getOrderIndex());
        response.setCreatedAt(section.getCreatedAt());
        response.setUpdatedAt(section.getUpdatedAt());
        if (section.getNotebook() != null) {
            response.setNotebookId(section.getNotebook().getId());
        }
        if (section.getParentSection() != null) {
            response.setParentSectionId(section.getParentSection().getId());
        }
        if (section.getSubSections() != null) {
            response.setSubSections(section.getSubSections().stream()
                .sorted(java.util.Comparator.comparing(Section::getOrderIndex, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
                .map(this::mapToResponse)
                .toList());
        }
        return response;
    }
}
