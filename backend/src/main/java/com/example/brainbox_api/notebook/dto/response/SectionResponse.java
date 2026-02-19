package com.example.brainbox_api.notebook.dto.response;

import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionResponse {
    private Long id;
    private String title;
    private String content;
    private Integer orderIndex;
    private Instant createdAt;
    private Instant updatedAt;
    private Long notebookId;
    private Long parentSectionId;
    private List<SectionResponse> subSections;
}
