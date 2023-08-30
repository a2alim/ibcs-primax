package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_rms_create_go_letter")
public class CreateGOLetter extends BaseEntity {

	@Column(name = "go_code")
	private String goCode;


	@Column(name = "m2_installment_process_id", nullable = false)
	private Long installmentProcessId;

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

	@Column(name = "mail_body")
	private String mailBody;

	@Column(name = "approved_status")
	private String approvedStatus;

	@Column(name = "enothi_number")
	private String enothiNumber;

	@Column(name = "bn_date")
	private String bnDate;

	@Column(name = "en_date")
	private String enDate;
}
