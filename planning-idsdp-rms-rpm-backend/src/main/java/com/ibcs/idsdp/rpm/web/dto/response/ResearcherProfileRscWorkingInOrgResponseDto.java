package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

/**
 *
 */
@Data
public class ResearcherProfileRscWorkingInOrgResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long researcherProfileId;
	private String researcherName;
	private String designation;
	private String mobileNo;
	private String emailAddress;
	private String nidNo;
	private String telephoneNo;
	private String educationQualification;
	private String occupation;
	private Integer age;
	private Integer isDeleted;
	private String personalDigitalInformation;
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
