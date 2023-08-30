package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class TaskListResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long researchProgressReportId;
	private String taskTitle;
	private Integer proposalPageNo;
	private String researcherNote;
	private String noteOfDo;
	private Boolean isCompleted;
	private Boolean isEditable;
}
