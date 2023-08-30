package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_go_letter")
public class GoLetter extends BaseEntity{
	
	
	@Column(name = "go_code")
	private String goCode;

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposalId;

	@NotNull
	@OneToOne
	@JoinColumn(name = "m2_installment_process_id")
	private InstallmentProcess installmentProcessId;

//	@Column(name = "st_installment_type_id", nullable = false)
//	private Long installmentTypeId;

	@Column(name = "st_fiscal_year_id")
	private Long fiscalYearId;

	@Column(name = "st_research_cat_type_id")
	private Long researchCatTypeId;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Column(name = "is_send", nullable = false)
	private Boolean isSend;

	@Column(name = "subject")
	private String subject;

	
	@Column(name = "mail_body",columnDefinition = "TEXT")
	private String mailBody;

	@Column(name= "template_type_id")
	private Long templateTypeId;

	@Column(name= "predefined_template_id")
	private Long predefinedTemplateId;

	@Column(name = "approved_status")
	private String approvedStatus;

	@Column(name = "enothi_number")
	private String enothiNumber;

	@Column(name = "bn_date")
	private String bnDate;

	@Column(name = "en_date")
	private String enDate;
	
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
