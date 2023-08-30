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
@Table(name = "M3_CHEQUE_COLLECTION")
public class ChequeCollectionModel extends BaseEntity {

    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = TrainingInstituteProfileModel.class)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID", nullable = false)
    private TrainingInstituteProfileModel trainingInstituteProfileModel;

    private LocalDate collectionDate;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private MinioAttachment chequeImage;

    @Column(length = 20)
    private String chequeReceiverPhoneNo;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private MinioAttachment signatureImageOfCollectingPerson;

    private String chequeNo;

    @Column(length = 17)
    private Long receiverNid;

    private Integer chequeAmount;

    private LocalDate chequeDate;

    private Integer tokenNo;

    private String installmentType;

    @Column(columnDefinition = "TEXT")
    private String acknowledgementLetter;

    private boolean isChequeReceived;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private MinioAttachment signaturedDocument;

    @ManyToOne(targetEntity = ProposalModel.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;
}
