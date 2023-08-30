package com.ibcs.idsdp.rpm.model.domain;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;

import lombok.Data;

@Data
@Entity
@Table(name = "m1_researcher_profile_personal_info")
public class ResearcherProfilePersonalInfoMaster extends BaseEntity {
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "rmsUserSignatureId")
	private UserSignature rmsUserSignatureId;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "rmsUserImageId")
	private UploadUsersImage rmsUserImageId;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "researcherProfileUploadAcknowledgementIncomeTaxId")
	private ResearcherProfileUploadAcknowledgementIncomeTax researcherProfileUploadAcknowledgementIncomeTaxId;

	@Column(name = "reg_number", nullable = false, length = 50, unique = true)
	private String regNumber;

	@Column(name = "user_id", nullable = false, length = 20, unique = true)
	private Long userId;

	@Column(nullable = false)
	private Date dateOfBirth;

	@Column(nullable = false, length = 3)
	private Integer age;

	@Column(nullable = false, length = 200)
	private String fatherName;

	@Column(nullable = false, length = 200)
	private String motherName;

	@Column(nullable = false, length = 200)
	private String emailAddress;

	@Column(nullable = false, length = 20)
	private String mobileNo;

	@Column(length = 255)
	private String researchTraining;

	@Column(length = 50)
	private String nIDNumber;

	@Column(length = 150)
	private String nIDVerificationStatus;

	@Column(length = 50)
	private String tINNumber;

	@Column(length = 150)
	private String tINVerificationStatus;

	@Column(length = 150)
	private String occupation;

	@Column(length = 150)
	private String designation;

	@Column(length = 500)
	private String declaration;

	@Column(length = 3)
	private String totalResearcherNumbers;

	@Column(nullable = false, length = 20)
	private Long divisionId;

	@Column(nullable = false, length = 20)
	private Long districtId;

	@Column(nullable = false, length = 20)
	private Long upzilaId;

	@Column(length = 20)
	private Long unionId;

	@Column(nullable = false, length = 255)
	private String anotherDetails;

	@Column(nullable = false, length = 20)
	private Long preDivisionId;

	@Column(nullable = false, length = 20)
	private Long preDistrictId;

	@Column(nullable = false, length = 20)
	private Long preUpzilaId;

	@Column(length = 20)
	private Long preUnionId;

	@Column(nullable = false, length = 255)
	private String preAnotherDetails;

	@Column(nullable = false)
	private boolean isPending;

	@Column(nullable = false)
	private boolean isDraftApproval;

	@Column(nullable = false)
	private boolean isFinalApproval;

	private boolean isEditable;

	@Transient
	private UserResponse userDto;

//	@Transient
//	private DivisionResponse divisionDto;
//
//	@Transient
//	private ZillaResponse districtDto;
//
//	@Transient
//	private UpaZillaResponse upzilaDto;
//
//	@Transient
//	private DivisionResponse preDivisionDto;
//
//	@Transient
//	private ZillaResponse preDistrictDto;
//
//	@Transient
//	private UpaZillaResponse preUpzilaDto;

	@Column(length = 20)
	private Long instYearOfEstablishment;

	@Column(length = 255)
	private String instAddressDetails;

	@Column(length = 255)
	private String instTelephoneNo;

	@Column(length = 255)
	private String instRegistrationNo;

	@Column(name = "phd")
	private Integer phd;

	@Column(name = "mphil")
	private Integer mphil;

	@Column(name = "masters")
	private Integer masters;

	private Integer totalResearchExperience;

	@Column(name = "IS_INSTITUTIONAL")
	private Boolean isInstitutional;

	private String instHeadName;

	private String instHeadDesignation;

	private Long fastClass;
	private Long secondClass;
	private Long thirdClass;
	private Long fourthClass;

	@Column(columnDefinition = "TEXT")
	private String InstituteActivities;

	@Column(columnDefinition = "TEXT")
	private String InfrastructuralFacilities;

	@Column(columnDefinition = "TEXT")
	private String nattionalIntResearchDescription;


	@Column(length = 50)
	private String accountName;

	@Column(length = 50)
	private String  accountNumber;

	@Column(length = 30)
	private String  nidNo;

	@Column(length = 15)
	private String  bankMobileNumber;

	@Column(length = 5000)
	private String fileDownloadUrl;

	@Column(length = 5000)
	private String bucketName;

	@Column(length = 5000)
	private String fileName;

	private String bankName;
	private String bankBranchName;

}
