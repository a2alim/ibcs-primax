package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_fiscal_year")
//@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class FiscalYear extends BaseEntity {

	@Column(name = "fiscal_year", nullable = false, length =100)
	private String fiscalYear;

	@Column(name = "note", nullable = false, length =250)
	private String note;

	@Column(name = "approval_status", nullable = false,length =40,columnDefinition = "integer default 0")
	private int approvalStatus;

	@Column(name = "active", nullable = false)
	private Boolean active;

}
