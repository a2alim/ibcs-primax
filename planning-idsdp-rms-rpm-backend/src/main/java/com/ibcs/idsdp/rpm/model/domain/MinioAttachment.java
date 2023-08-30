package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

/**
 * Created by : rakibul.hasan on 4/26/2022 12:58 PM
 * github : https://github.com/rhmtechno
 */
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "minio_attachment")
@Data
public class MinioAttachment  extends BaseEntity {

    private String fileName;

    @Column(name = "FILE_URL")
    private String downloadUrl;

    private String bucketName;

}
