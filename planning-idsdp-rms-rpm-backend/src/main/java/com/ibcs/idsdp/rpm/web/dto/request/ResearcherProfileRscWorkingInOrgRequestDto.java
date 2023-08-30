package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;

/**
 *
 */
@Data
public class ResearcherProfileRscWorkingInOrgRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
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
	private Integer isDeleted=0;
	private String personalDigitalInformation;	
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
