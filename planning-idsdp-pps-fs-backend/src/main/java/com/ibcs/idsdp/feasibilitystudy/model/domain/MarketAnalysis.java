package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "fsr_market_analysis")
@EntityListeners(AuditingEntityListener.class)
public class MarketAnalysis extends BaseEntity {
    @Column(columnDefinition = "TEXT")
    private String prbStatement;

    @Column(columnDefinition = "TEXT")
    private String relevanceProjectIdea;

    @Column(columnDefinition = "TEXT")
    private String proposedProjectInterventions;

    @Column(columnDefinition = "TEXT")
    private String stakeholders;

    @Column(columnDefinition = "TEXT")
    private String currentDemand;

    @Column(columnDefinition = "TEXT")
    private String futureDemand;

    @Column(columnDefinition = "TEXT")
    private String variousDemand;

    @Column(columnDefinition = "TEXT")
    private String swotAnalysis;

    @OneToOne
    Attachment attachment;

    private Long fsrMasterId;
}
