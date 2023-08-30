package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class letterForStackohlderResponseDto {
	private UploadUsersImage rmsUserImageId;
	private UserSignature rmsUserSignatureId;
	private String userId;
	private Date dateOfBirth;
	private Integer age;
	private String fatherName;
	private String motherName;
	private String emailAddress;
	private String mobileNo;
	private String researchTraining;
	private String nIDNumber;
	private String nIDVerificationStatus ;
	private String tINNumber ;
	private String tINVerificationStatus ;
	private String occupation ;
	private String designation ;
	private String totalResearcherNumbers ;
	private String divisionId ;
	private String districtId ;
	private String upzilaId ;
	private String unionId ;
	private String anotherDetails ;
	private String detailsPresentAddress ;
	private boolean isPending;
	private boolean isDraftApproval;
	private boolean isFinalApproval;
	private boolean isEditable;
}
