package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "comments")
@EntityListeners(AuditingEntityListener.class)
public class Comments extends BaseEntity {

//    @NotNull
//    @ManyToOne
//    @JoinColumn(name = "project_summary_id", nullable = false)
//    private ProjectConceptMaster projectConceptMaster;

    @NotNull
    private Long sourceId;

    @NotNull
    private SourceEnum commentsSource;

    @NotNull
    @Column(length = 1000)
    private String comment;

    @NotNull
    @Column(length = 255)
    private String observer;

    @NotNull
    private Long commentBy;

    @NotNull
    private LocalDate commentOn;
}
