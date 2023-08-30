package com.ibcs.idsdp.rpm.web.dto.response;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;

import lombok.Data;


@Data
public class ViewResearcherDto {
	
	
	private Long proposalId;
	private String proposalUuid;
	private Long researcherProfilePersonalInfoMasterId;
	private Long stFiscalYearId;
	private String researchTitle;

	/* proposal end */
	private Long profileId;
	private String profileUuid;	
	private Long userId;	

	

}
