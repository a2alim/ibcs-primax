package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "M3_PROGRESS_VERIFICATION")
public class ProgressVerificationModel extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel trainingInstituteProfileModel;

    private String examinerUserId;

    private LocalDate verificationDate;

//    @Column(columnDefinition = "TEXT")
//    private String researchTitle;

    private Integer numberOfManPower;

    @Column(columnDefinition = "TEXT")
    private String organizationActivity;

    @Column(columnDefinition = "TEXT")
    private String monitoring;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @OneToOne(cascade = CascadeType.ALL)
    private MinioAttachment nothi;

    private Long fiscalYearId;

    @ManyToOne(targetEntity = ProposalModel.class, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;
}
