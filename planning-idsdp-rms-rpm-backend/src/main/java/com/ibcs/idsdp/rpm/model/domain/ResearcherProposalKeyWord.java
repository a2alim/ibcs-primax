package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;


@Table(name = "researcher_proposal_key_word")
@Entity
@Data
public class ResearcherProposalKeyWord extends BaseEntity{
	
	private Long   researcherProposalId;	
	private String keyWord;

}
