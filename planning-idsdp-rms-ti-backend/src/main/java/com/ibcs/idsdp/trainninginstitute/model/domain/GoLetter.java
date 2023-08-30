package com.ibcs.idsdp.trainninginstitute.model.domain;

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
	@JoinColumn(name = "m3_partial_final_payment_id")
	private PartialFinalPaymentNewModel partialFinalPaymentId;


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
