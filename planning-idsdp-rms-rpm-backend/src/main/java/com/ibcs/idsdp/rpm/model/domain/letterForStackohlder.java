package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "fs_create_request_letter_for_stackohlder")
@Entity
@Data
public class letterForStackohlder extends BaseEntity {

	@Column(name = "st_fiscal_year_id", nullable = false)
	private Long stFiscalYearId;
	@Column(name = "st_sector_type_id", nullable = false)
	private Long stSectorTypeId;
	@Column(name = "last_feedback_date", nullable = false)
	private LocalDateTime lastFeedbackDate;
	@Column(name = "recipient_name", nullable = false, length =250)
	private String	recipientName;
	@Column(name = "recipient_designation", nullable = false, length =250)
	private String recipientDesignation;
	@Column(name = "recipient_Office_address", length =250)
	private String recipientOfficeAddress;
	@Column(name = "mobile_no", length =250)
	private String mobileNo;
	@Column(name = "email_address", nullable = false, length =250)
	private String emailAddress;
	@Column(name = "details", nullable = false, columnDefinition="TEXT")
	private String details;
	@Column(name = "letter_status", nullable = false,length =40,columnDefinition = "integer default 0")
	private Integer letterStatus;

}
