package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "M3_COMPLETION_REPORT")
public class CompletionReportModel extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String background;

    @Column(columnDefinition = "TEXT")
    private String workshopObjectives;

    private String percentageOfAttendance;

    private String onlineAssessment;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    private Boolean isFinalSubmitted;

}
