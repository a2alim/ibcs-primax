package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "fsr_other_analysis")
@EntityListeners(AuditingEntityListener.class)
public class OtherAnalysis extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String humanResourceAnalysis;

    @Column(columnDefinition = "TEXT")
    private String institutionalAnalysis;

    @Column(columnDefinition = "TEXT")
    private String riskSensitivityAnalysis;

    @Column(columnDefinition = "TEXT")
    private String alternativesAnalysis;

    @Column(columnDefinition = "TEXT")
    private String recommendationConclution;

    @OneToOne
    Attachment attachment;

    private Long fsrMasterId;
}
