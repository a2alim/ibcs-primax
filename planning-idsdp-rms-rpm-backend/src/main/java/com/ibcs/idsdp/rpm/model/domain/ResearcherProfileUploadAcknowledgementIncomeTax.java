package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m1_researcher_profile_upload_acknowledgement_income_tax")
public class ResearcherProfileUploadAcknowledgementIncomeTax extends BaseEntity {

	private String bucketName;
	private String downloadUrl;
	private String fileName;

}
