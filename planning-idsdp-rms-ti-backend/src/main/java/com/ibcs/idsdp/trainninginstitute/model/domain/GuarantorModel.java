package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_GUARANTOR")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class GuarantorModel extends BaseEntity {

    @ManyToOne(targetEntity = ProposalModel.class,cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    private String guarantorName;

    private String jobInfo;

    private String designation;

    @Column(length = 20)
    private String mobileNo;

    private String email;

    private String presentAddress;

    private String permanentAddress;

    private Integer refundDays;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment uploadFile;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment image;

    @Column(length = 17)
    private Long nid;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment signatureImage;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private MinioAttachment nidImage;

    private Boolean isActive;

    private Long fiscalYearId;

    private boolean isSubmitted;

}
