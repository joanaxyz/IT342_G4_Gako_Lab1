package com.example.brainbox_api.editor.entity;

import java.time.Instant;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer orderIndex;

    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name="document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "parent_section_id")
    private Section parentSection;

    @OneToMany(mappedBy = "parentSection", cascade = CascadeType.ALL)
    private List<Section> subSections;

    @PrePersist
    private void prePersist(){
        if(createdAt == null) createdAt = Instant.now();
    }
}
