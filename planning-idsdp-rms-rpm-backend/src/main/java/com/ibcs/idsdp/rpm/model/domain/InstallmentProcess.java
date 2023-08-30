package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_installment_process")
public class InstallmentProcess extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "m1_researcher_proposal_id")
    private ResearcherProposal m1ResearcherProposalId;

//    @Column(name = "st_installment_type_id", nullable = false)
//    private Long stInstallmentTypeId;

    @Column(name = "st_installment_type_id", nullable = true)
    private Long stInstallmentTypeId;

    @Column(name = "percentage_amount")
    private Integer percentageAmount;

    @Column(name = "tk_amount")
    private Double tkAmount;

    @Column(name = "installment_date")
    private Date installmentDate;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "mail_body", columnDefinition = "Text", nullable = false)
    private String mailBody;

    @Column(name = "installment_status")
    private String installmentStatus;

    @Column(name = "is_send")
    private Boolean isSend;

    @Column(name = "go_letter_uuid",nullable = true)
    private String goLetterUuid;

    //added for required change
    @Column(name = "installment_types",nullable = true,columnDefinition = "Text")
    private String installmentTypes;

    @Column(name = "prc_amount",nullable = true)
    private String prcAmount;

    @Column(name = "total_amount",nullable = true)
    private String  totalAmount;



}
