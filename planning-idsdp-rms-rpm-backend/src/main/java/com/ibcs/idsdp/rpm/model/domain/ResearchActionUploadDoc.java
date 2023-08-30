package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_take_action_for_research_upload_doc")
public class ResearchActionUploadDoc extends BaseEntity {

	@Column(name = "m2_take_action_for_research_id", nullable = false)
	private Long takeActionForResearchId;

	@Column(name = "file_title")
	private String fileTitle;

	@Column(name = "bucket_name")
	private String bucketName;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "download_url")
	private String downloadUrl;
}
