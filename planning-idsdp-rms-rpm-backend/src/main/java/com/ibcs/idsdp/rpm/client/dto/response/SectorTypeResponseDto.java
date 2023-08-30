package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorTypeResponseDto extends UuidIdHolderRequestBodyDTO {
	
	private Boolean active;	
//	private Long stResearchCategoryTypeId;
	private String fieldName;	
	private Integer approvalStatus;
	private ResearchCategoryTypeResponseDto stResearchCategoryTypeId;

}
