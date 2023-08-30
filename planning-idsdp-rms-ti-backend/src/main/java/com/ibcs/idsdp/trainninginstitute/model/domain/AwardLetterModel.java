package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.trainninginstitute.enums.AwardLetterStatus;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_AWARD_LETTER")
public class AwardLetterModel extends BaseEntity {

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mailBody;

    private boolean mailStatus;

    @Column(nullable = false)
    private AwardLetterStatus status;

    private String memorandumNo;

    private String nothiDateEn;

    private String nothiDateBn;

    private Long fiscalYearId;
}
