package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchActionUploadDocRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long takeActionForResearchId;
	private String fileTitle;
	private String bucketName;
	private String fileName;
	private String downloadUrl;
	private Integer isEditable;
	private Integer deleted;
}
