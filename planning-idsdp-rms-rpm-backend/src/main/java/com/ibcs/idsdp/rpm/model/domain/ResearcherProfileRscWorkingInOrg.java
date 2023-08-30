package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 *
 */
@Table(name = "m1_researcher_profile_rsc_working_in_org")
@Entity
@Data
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProfileRscWorkingInOrg extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_profile_id")
	private ResearcherProfilePersonalInfoMaster researcherProfileId;

	private String researcherName;

	private String designation;

	private String mobileNo;

	private String emailAddress;

	private String nidNo;

	private String telephoneNo;

	private String educationQualification;

	private String occupation;

	private Integer age;
	
	private String personalDigitalInformation;
	
	@Column(length = 5000)
	private String fileDownloadUrl;

	@Column(length = 5000)
	private String bucketName;

	@Column(length = 5000)
	private String fileName;

	
}
