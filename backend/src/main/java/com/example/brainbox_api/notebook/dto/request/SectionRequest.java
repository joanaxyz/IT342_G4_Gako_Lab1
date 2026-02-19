package com.example.brainbox_api.notebook.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionRequest {
    private String title;
    private String content;
    private Integer orderIndex;
    private Long notebookId;
    private Long parentSectionId;
}
