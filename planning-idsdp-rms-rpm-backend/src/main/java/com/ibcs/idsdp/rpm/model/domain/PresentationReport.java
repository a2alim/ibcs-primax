package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_create_presentation_report")
public class PresentationReport extends BaseEntity {
	
	@OneToOne
	@JoinColumn(name = "m2_create_seminar_id")
	private CreateSeminar createSeminar;
	
	private String subject;

	@Column(columnDefinition = "TEXT")
	private String firstContent;

	@Column(columnDefinition = "TEXT")
	private String lastContent;
	
	@NotNull
	private Boolean isEditable;

}
