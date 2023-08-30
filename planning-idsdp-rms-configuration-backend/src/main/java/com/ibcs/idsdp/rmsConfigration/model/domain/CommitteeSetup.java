package com.ibcs.idsdp.rmsConfigration.model.domain;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@Entity
@Table(name = "st_committee_setup")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class CommitteeSetup extends BaseEntity {

	@Column(name = "committee_no", length = 20)
	private Long committeeNo;

	@Column(name = "user_id", length = 20)
	private Long userId;

	@ManyToOne(optional = false)
	@JoinColumn(name = "st_fiscal_year_id")
	private FiscalYear stFiscalYearId;

	@ManyToOne(optional = false)
	@JoinColumn(name = "st_committee_type_id")
	private CommitteeType stCommitteeTypeId;

	@Column(name = "role_in_committe", length = 1)
	private Integer isChairman;

	@Column(name = "effective_from_date")
	private LocalDate effectiveFromDate;

	@Column(name = "effective_end_date ")
	private LocalDate effectiveEndDate;

	@Column(name = "approval_status", length = 1)
	private Integer approvalStatus;

	@Column(name = "upload_eNothi_app_files", length = 250)
	private String uploadENothiAppFiles;

	@Column(name = "active", nullable = false)
	private Boolean active;

}
