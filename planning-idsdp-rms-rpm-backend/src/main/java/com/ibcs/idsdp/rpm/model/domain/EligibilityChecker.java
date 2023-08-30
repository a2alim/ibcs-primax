package com.ibcs.idsdp.rpm.model.domain;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m1_eligibility_checkers")
public class EligibilityChecker {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String uuid;

	@Column(name = "is_deleted", nullable = false)
	private Boolean isDeleted;

	private String personName;
	private Long stResearchCatTypeId;
	private LocalDate dateOfBirth;

	private String graduateResult;
	private Boolean isGovEmployee;

	private String postGraduateResult;
	private Boolean isThesisGroup;

	private Boolean isMPhil;
	private Boolean isPhD;

	private String totalResearchExperience;
	private String journalPublicationLocQty;
	private String journalPublicationIntQty;

	private Boolean isResearchTraining;
	private String nidNumber;
	private String nidVerificationStatus;

}
