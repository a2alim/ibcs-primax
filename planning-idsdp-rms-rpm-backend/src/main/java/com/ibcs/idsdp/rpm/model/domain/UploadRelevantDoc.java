package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rms_upload_relevant_doc")
public class UploadRelevantDoc extends BaseEntity {

    private String relevantDocUrl;

    private String bucketName;

    private String fileName;

    private boolean isEditable;

    private boolean isActive;
}
