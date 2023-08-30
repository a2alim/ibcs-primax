package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.FetchMode;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Cache;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import java.time.LocalDate;
import java.util.List;

import static javax.persistence.FetchType.EAGER;

@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExpertEvaluator extends BaseEntity {

	private String name;

	private Long userId;

	private String presentProfession;

	@Column(columnDefinition = "TEXT")
	private String presentOfficeNameAddress;

	private long stSpecialityTypeId;

	private LocalDate dateOfBirth;

	private String mobileNo;

	private String emailAddress;

	private Boolean thesisGroup;

	private Integer totalResearchExpYear;

	@Column(columnDefinition = "TEXT")
	private String researchExperienceDetail;

	private String otherExpertAreas;

	private String nidNumber;

	private String tinNumber;

	private Integer evaluatortype;

	private Integer nationalPublicationsNumber;

	private Integer internationalPublicationsNumber;

	@OneToMany(targetEntity = ExpertEvaluatorEducation.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "education_fk", referencedColumnName = "id")
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<ExpertEvaluatorEducation> educations;

	@OneToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	@JoinColumn(name = "sector_sub_sectors_id", referencedColumnName = "id")
	private List<ExpertEvaluatorSectorSubSector> sectorSubSectors;

//	@OneToOne(cascade = CascadeType.ALL)
//	@JoinColumn(name = "expertEvaluatorBySsrc")
//	private ExpertEvaluatorBySsrc expertEvaluatorBySsrc;

}
