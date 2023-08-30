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
@Table(name = "st_committee_type")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class CommitteeType extends BaseEntity {

	@Column(name = "committee_name", nullable = false, length = 250)
	private String committeeName;
	
	@Column(name = "active", nullable = false)
	private Boolean active;
	
	

}
