package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileUploadAcknowledgementIncomeTax;
import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class ResearcherProfilePersonalInfoMasterResponse extends UuidIdHolderRequestBodyDTO {

	private UserSignature rmsUserSignatureId;

	private UploadUsersImage rmsUserImageId;

	private ResearcherProfileUploadAcknowledgementIncomeTax researcherProfileUploadAcknowledgementIncomeTaxId;

	private String regNumber;

	private Long userId;

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
	private String detailsPresentAddress;

	private Long preDivisionId;
	private Long preDistrictId;
	private Long preUpzilaId;
	private Long preUnionId;
	private String preAnotherDetails;
	private String preDetailsPresentAddress;

	private boolean isPending;
	private boolean isDraftApproval;
	private boolean isFinalApproval;
	private boolean isEditable;
	private UserResponse userDto;

	private DivisionResponse divisionDto;

	private ZillaResponse districtDto;

	private UpaZillaResponse upzilaDto;

	private DivisionResponse preDivisionDto;

	private ZillaResponse preDistrictDto;

	private UpaZillaResponse preUpzilaDto;

	private Long instYearOfEstablishment;
	private String instAddressDetails;
	private String instTelephoneNo;
	private String instRegistrationNo;
	private String declaration;

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
