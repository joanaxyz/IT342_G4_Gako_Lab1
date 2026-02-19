package com.example.brainbox_api.notebook.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.brainbox_api.notebook.entity.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByNotebookIdAndParentSectionIsNullOrderByOrderIndexAsc(Long notebookId);
    List<Section> findByParentSectionIdOrderByOrderIndexAsc(Long parentSectionId);
}
