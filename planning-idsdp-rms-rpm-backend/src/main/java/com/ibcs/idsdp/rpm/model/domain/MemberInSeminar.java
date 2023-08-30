package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "member_in_seminar")
@Entity
@Data
public class MemberInSeminar extends BaseEntity {

	@ManyToOne(optional = false, fetch = FetchType.EAGER)
	@JoinColumn(name = "m2_create_seminar_id")
	private CreateSeminar createSeminarId;
	
	private String name;
	private String emailId;
	private String designation;
	private String mobileNumber;
	private Long serial;

}
