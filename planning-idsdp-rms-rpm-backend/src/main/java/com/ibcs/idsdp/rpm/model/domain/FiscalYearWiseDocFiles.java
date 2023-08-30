package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "fiscal_year_wise_doc_files")
public class FiscalYearWiseDocFiles extends BaseEntity {

	private Long stFiscalYearId;
	private String fileFor;
	private String fileShortDescription;

	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
