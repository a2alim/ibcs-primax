package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.ManyToAny;

@Table(name = "m1_researcher_supervisor_info")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherSupervisorInfo extends BaseEntity {

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private String supervisorName;

	@NotNull
	private String presentOfficeName;

	@NotNull
	private String presentOfficeAddress;

	private String mobileNo;

	private String emailAddress;

	private String nIdNumber;

	private String tinNumber;

	private Integer isEditable;

}
