package com.ibcs.idsdp.common.model.domain;

import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "minio_attachment")
@Data
public class MinioAttachment  extends BaseEntity{

    private String fileName;

    @Column(name = "FILE_URL")
    private String downloadUrl;

    private String bucketName;

}
