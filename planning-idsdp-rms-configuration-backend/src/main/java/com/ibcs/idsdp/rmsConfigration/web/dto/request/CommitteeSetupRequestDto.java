package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;

import lombok.Data;

@Data
public class CommitteeSetupRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long committeeNo;
	private Long userId;
	
	private FiscalYear stFiscalYearId;
	private CommitteeType stCommitteeTypeId;
	
	private Integer isChairman;
	private LocalDate effectiveFromDate;
	private LocalDate effectiveEndDate;
	private Integer approvalStatus;
	private String uploadENothiAppFiles;
	private Boolean active;

}
