package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class FiscalYearWiseDocFilesRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long stFiscalYearId;
	private String fileFor;
	private String fileShortDescription;

	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
