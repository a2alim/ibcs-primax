package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "fsr_technical_analysis")
@EntityListeners(AuditingEntityListener.class)
public class TechnicalAnalysis extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(columnDefinition = "TEXT")
    private String technicalDesign;

    @Column(columnDefinition = "TEXT")
    private String outputPlan;

    @Column(columnDefinition = "TEXT")
    private String costEstimates;

    @Column(columnDefinition = "TEXT")
    private String impTimeline;

    @OneToOne
    Attachment attachment;

    private Long fsrMasterId;
}
