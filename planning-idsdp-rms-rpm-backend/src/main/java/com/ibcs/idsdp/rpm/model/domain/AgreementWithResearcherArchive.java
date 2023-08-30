package com.ibcs.idsdp.rpm.model.domain;

import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m1_agreement_with_researcher_archive")
public class AgreementWithResearcherArchive extends BaseEntity {

	@Column(name = "m1_researcher_proposal_id")
	private Long researcherProposalId;

	@Column(name = "m1_agreement_with_researcher_id")
	private Long agreementWithResearcherId;

	@Column(name = "total_grant_amount", nullable = false)
	private Double totalGrantAmount;

	@Column(name = "installment_no", nullable = false)
	private Integer installmentNo;

	@Column(name = "research_start_date")
	private LocalDate researchStartDate;

	@Column(name = "research_end_date")
	private LocalDate researchEndDate;

	@Column(name = "research_duration")
	private String researchDuration;

	@Column(name = "first_page", nullable = false, columnDefinition = "TEXT")
	private String firstPage;

	@Column(name = "second_page", nullable = false, columnDefinition = "TEXT")
	private String secondPage;

	@Column(name = "third_page", columnDefinition = "TEXT")
	private String thirdPage;

	@Column(name = "fourth_page", columnDefinition = "TEXT")
	private String fourthPage;

	@Column(name = "recipient_user_id")
	private Integer recipientUserId;

	@Column(name = "is_editable")
	private Boolean isEditable;

	@Column(name = "approval_status")
	private Integer approvalStatus;

	@PrePersist
	public void setStatus() {
		setApprovalStatus(0);
	}

	@Transient
	private String recipientUser;
}
