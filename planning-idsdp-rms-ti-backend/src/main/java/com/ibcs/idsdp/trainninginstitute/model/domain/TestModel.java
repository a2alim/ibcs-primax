package com.ibcs.idsdp.trainninginstitute.model.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Table(name = "test")
@Entity
@Data
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class TestModel extends BaseEntity {

	private String name;
	private String email;

}
