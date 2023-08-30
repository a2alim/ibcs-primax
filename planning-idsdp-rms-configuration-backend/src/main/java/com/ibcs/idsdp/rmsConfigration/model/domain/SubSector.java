package com.ibcs.idsdp.rmsConfigration.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@Entity
@Table(name = "st_sub_sectors")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class SubSector extends BaseEntity {

	@Column(name = "sub_field_name", length = 250)
	String subFieldName;

	@ManyToOne(optional = false)
	@JoinColumn(name = "st_sector_type_id")
	private SectorType sectorTypeId;

	@Column(name = "approval_status", length = 1)
	private Integer approvalStatus;
	
	@Column(name = "active", nullable = false)
	private Boolean active;
	
	@PrePersist
	public void  setData() {
		setApprovalStatus(1);
	}
	
	@PreUpdate
	public void  setUpdateData() {
		setApprovalStatus(1);
	}

}
