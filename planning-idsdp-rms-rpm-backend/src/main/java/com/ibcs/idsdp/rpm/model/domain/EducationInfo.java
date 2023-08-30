package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "m1_researcher_profile_education_info")
public class EducationInfo extends BaseEntity {

	@Column(nullable = false, length = 20)
	private long profilePersonalInfoId;

	@Column(nullable = false, length = 255)
	private String certificationName;	
	
	private String superviserInformation;

	@Column(length = 250)
	private String discipline;

	@Column(nullable = false, length = 10)
	private String passingYearMonth;

	@Column(length = 30)
	private String division;

	@Column(length = 30)
	private String scale;

	@Column(length = 10)
	private String cgpa;

	@Column(nullable = false, length = 255)
	private String instituteName;

	@Column(length = 1)
	private Long divisionClassOrCgpa;

	private Boolean isForeign;

	@Column(length = 150)
	private String universityRegNo;

	private Boolean isEditable;

	@Column(length = 255)
    private String registrationNo;

	@Column(length = 1)
	private Integer thesisGroup;

	@Column(length = 255)
    private String subject;

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private MinioAttachment fileUploadModel;


}
