package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "comments_fs")
@EntityListeners(AuditingEntityListener.class)
public class Comments extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "fsp_summary_id", nullable = false)
    private FspSummary fspSummaryMaster;

    @Column(length = 1000)
    private String comment;

    @Column(length = 255)
    private String observer;

    @Column(length = 255)
    private String commentBy;

    private LocalDate commentOn;
}
