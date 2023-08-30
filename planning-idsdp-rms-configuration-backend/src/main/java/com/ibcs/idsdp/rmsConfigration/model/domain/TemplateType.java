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
@Table(name = "st_template_type")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class TemplateType extends BaseEntity {

	@Column(name = "template_type", nullable = false, length =250)
	private String templateType;

	@Column(name = "active", nullable = false)
	private Boolean active;

}
