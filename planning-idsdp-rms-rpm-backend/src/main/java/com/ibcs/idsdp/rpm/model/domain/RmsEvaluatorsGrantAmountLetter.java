package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Table(name = "rms_evaluators_grant_amount_letter")
@Entity
@Data
public class RmsEvaluatorsGrantAmountLetter extends BaseEntity {

	@NotNull
	private Long stFiscalYearId;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String topContent;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String bottomContent;

	private String uploadSignatureFile;

}
