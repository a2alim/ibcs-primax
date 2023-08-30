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
@Table(name = "st_user_serialization")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserSerialization extends BaseEntity {

	@Column(name = "serial", nullable = false, length =11)
	private Integer serial;

	@Column(name = "user_id", nullable = false, length =20)
	private Integer userId;

	@Column(name = "designation", nullable = false,length =250)
	private String designation;

	@Column(name = "is_active", nullable = false)
	private Boolean isActive;

}
