package com.example.brainbox_api.notebook.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionOrderRequest {
    private Long id;
    private Long parentSectionId;
    private Integer orderIndex;
}
