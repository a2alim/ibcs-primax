package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PARTICIPANT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ParticipantModel extends BaseEntity {

    @ManyToOne(targetEntity = ProposalModel.class,cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    private String name;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String email;

    @Column(length = 20)
    private String phoneNo;

    private String presentAddress;

    private String permanentAddress;

    private String howYouKnowThisProgram;

    private String facebookOrTwitterLink;

    private String ifOthers;

    private String organizationName;

    private String designation;

    private String organizationAddress;

    private Integer yearsOfExperience;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = AcademicBackgroundModel.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "M3_PARTICIPANT_ID")
    private List<AcademicBackgroundModel> academicBackgroundModels;

    @Column(length = 17)
    private Long nidNo;

    @OneToOne(cascade = CascadeType.ALL)
    private MinioAttachment image;

    @OneToOne(cascade = CascadeType.ALL)
    private MinioAttachment nidImage;

    private Long fiscalYearId;

    private Boolean ifAnyJobInfo;

    private boolean isEditable;

    private Integer otpCode;

    private Boolean isCompleted;
}
