package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "fsr_risk_analysis")
@EntityListeners(AuditingEntityListener.class)
public class RiskAnalysis extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String envClimateChangeAnalysis;

    @Column(columnDefinition = "TEXT")
    private String assessmentDisasterResilienceProject;

    @OneToOne
    Attachment attachment;

    private Long fsrMasterId;
}
