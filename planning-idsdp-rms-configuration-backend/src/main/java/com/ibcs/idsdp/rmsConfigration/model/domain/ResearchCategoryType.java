package com.ibcs.idsdp.rmsConfigration.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@Entity
@Table(name = "st_research_category_type")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearchCategoryType extends BaseEntity {

	@Column(name = "category_name", nullable = false, length = 100)
	private String categoryName;

	@Column(name = "active", nullable = false)
	private Boolean active;

}
