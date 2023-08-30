package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

import javax.persistence.Column;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class ResearcherProfilePersonalInfoMasterRequest extends UuidIdHolderRequestBodyDTO {
	private String userId;
	private Date dateOfBirth;
	private Integer age;
	private String fatherName;
	private String motherName;
	private String emailAddress;
	private String mobileNo;
	private String researchTraining;
	private String nIDNumber;
	private String nIDVerificationStatus;
	private String tINNumber;
	private String tINVerificationStatus;
	private String occupation;
	private String designation;
	private String totalResearcherNumbers;

	private Long divisionId;
	private Long districtId;
	private Long upzilaId;
	private Long unionId;
	private String anotherDetails;

	private Long preDivisionId;
	private Long preDistrictId;
	private Long preUpzilaId;
	private Long preUnionId;
	private String preAnotherDetails;

	private boolean isPending;
	private boolean isDraftApproval;
	private boolean isFinalApproval;
	private boolean isEditable;

	private Long instYearOfEstablishment;
	private String instAddressDetails;
	private String instTelephoneNo;
	private String declaration;
	private String instRegistrationNo;

	private Integer phd;

	private Integer mphil;

	private Integer masters;

	private Boolean isInstitutional;
	private Integer totalResearchExperience;

	private String instHeadName;
	private String instHeadDesignation;

	private Long fastClass;
	private Long secondClass;
	private Long thirdClass;
	private Long fourthClass;
	private String instituteActivities;
	private String infrastructuralFacilities;
	private String nattionalIntResearchDescription;

	private String accountName;
	private String  accountNumber;
	private String  nidNo;
	private String  bankMobileNumber;
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;
	private String bankName;
	private String bankBranchName;
}
