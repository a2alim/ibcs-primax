package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_create_task_list")
public class TaskList extends BaseEntity {

	@Column(name = "m2_submit_research_progress_report_id")
	private Long researchProgressReportId;

	@Column(name = "task_title")
	private String taskTitle;

	@Column(name = "proposal_page_no")
	private Integer proposalPageNo;

	@Column(name = "researcher_note")
	private String researcherNote;

	@Column(name = "note_of_do")
	private String noteOfDo;

	@Column(name = "is_completed")
	private Boolean isCompleted;

	@Column(name = "is_editable")
	private Boolean isEditable;

}
