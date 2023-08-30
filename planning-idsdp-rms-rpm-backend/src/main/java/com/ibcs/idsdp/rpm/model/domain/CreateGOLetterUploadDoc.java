package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "rms_create_go_letter_upload_doc")
public class CreateGOLetterUploadDoc extends BaseEntity {

	@Column(name = "rms_create_go_letter_id")
	private Long goLetterId;

	@Column(name = "file_title")
	private String fileTitle;

	@Column(name = "bucket_name")
	private String bucketName;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "download_url")
	private String downloadUrl;
}
