package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ReceivedBankChequeUploadDocResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long receivedBankChequeId;
	private String fileTitle;
	private String bucketName;
	private String fileName;
	private String downloadUrl;
}
