package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "rms_received_bank_cheque_upload_doc")
public class ReceivedBankChequeUploadDoc  extends BaseEntity {

	@Column(name= "rms_received_bank_cheque_id", nullable = false)
	private Long receivedBankChequeId;

	@Column(name = "file_title")
	private String fileTitle;

	@Column(name = "bucket_name")
	private String bucketName;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "download_url")
	private String downloadUrl;
}
