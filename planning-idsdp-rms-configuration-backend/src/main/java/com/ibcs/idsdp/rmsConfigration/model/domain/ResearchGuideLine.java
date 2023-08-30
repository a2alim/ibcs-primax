package com.ibcs.idsdp.rmsConfigration.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "research_guide_line")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearchGuideLine extends BaseEntity {
	
	private Integer type;	
	
	private String title;
	
	@Column(columnDefinition = "TEXT")	
	private String details;
	
	private Boolean isActive;
	
	private String titleEn;
	
	@Column(columnDefinition = "TEXT")	
	private String detailsEn;
	
}
