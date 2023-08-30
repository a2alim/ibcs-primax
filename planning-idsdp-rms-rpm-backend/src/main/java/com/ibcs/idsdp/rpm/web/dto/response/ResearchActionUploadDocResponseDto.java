package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchActionUploadDocResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long takeActionForResearchId;
	private String fileTitle;
	private String bucketName;
	private String fileName;
	private String downloadUrl;
}
