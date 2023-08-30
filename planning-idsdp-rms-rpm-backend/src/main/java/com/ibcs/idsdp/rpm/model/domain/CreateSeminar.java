package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import java.time.LocalDate;
import java.util.Date;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_create_seminar")
public class CreateSeminar extends BaseEntity {

//   @ManyToOne(optional = false,fetch = FetchType.LAZY)
//   @JoinColumn(name = "m1_agreement_with_researcher_id")
//   private AgreementWithResearcher agreementWithResearcherId;

	@Column(name = "st_fiscal_year_id")
	private Long stFiscalYearId;

	@Column(name = "subject")
	private String subject;

	@Column(name = "seminar_no")
	private Long seminarNo;

	@Column(name = "presentation_type")
	private Long presentationType;

	@Column(name = "presentation_status")
	private Long presentationStatus;

	@Column(name = "program_nature")
	private Long programNature;

	@Column(name = "total_presentation_no")
	private Long totalPresentationNo;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "day_name")
	private String dayName;

	@Column(name = "presentation_time")
	private String presentationTime;

	@Column(name = "bhavan_no")
	private String bhavanNo;

	@Column(name = "room_no")
	private String roomNo;

	@Column(name = "room_name")
	private String roomName;

	@Column(name = "paragraph_one", columnDefinition = "TEXT")
	private String paragraphOne;

	@Column(name = "paragraph_two", columnDefinition = "TEXT")
	private String paragraphTwo;

	@Column(name = "is_mail_sent")
	private boolean isMailSent;

	@Column(name = "is_editable", columnDefinition = "boolean default false")
	private Boolean isEditable;

	// new added column
	@Column(name = "memorandum_no")
	private String memorandumNo;

	private String nothiDateEn;

	private String nothiDateBn;
	
	private String letterType;
	
	private LocalDate seminarDate;

}
