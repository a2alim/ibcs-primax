package com.ibcs.idsdp.rpm.model.domain;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "rms_received_bank_cheque")
public class ReceivedBankCheque extends BaseEntity {

	@Column(name = "m1_researcher_proposal_id", nullable = false)
	private Long researcherProposalId;

	@Column(name = "m2_installment_process_id", nullable = false)
	private Long installmentProcessId;

	@Column(name = "rms_create_go_letter_id", nullable = false)
	private Long createGoLetterId;

	@Column(name = "st_installment_type_id", nullable = false)
	private Long installmentTypeId;

	@Column(name = "st_fiscal_year_id")
	private Long fiscalYearId;

	@Column(name = "st_research_cat_type_id")
	private Long researchCatTypeId;

	@Column(name = "template_type_id")
	private Long templateTypeId;

	@Column(name = "predefined_template_id")
	private Long predefinedTemplate;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Column(name = "grant_amount")
	private Double grantAmount;

	@Column(name = "received_amount")
	private Double receivedAmount;

	@Column(name = "cheque_number")
	private String chequeNumber;

	@Column(name = "cheque_date")
	private LocalDate chequeDate;

	@Column(name = "token_no")
	private String tokenNo;

	@Column(name = "subject")
	private String subject;

	@Column(name = "mail_body")
	private String mailBody;

	@Column(name = "is_send", nullable = false)
	private Boolean isSend;

	@Column(name = "status")
	private Boolean status;

	@Column(name = "received_status")
	private String receivedStatus;
}
