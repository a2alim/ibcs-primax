package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
@Entity
@Table(name = "rms_upload_users_image")
public class UploadUsersImage extends BaseEntity {

    private String userImageUrl;

    private String bucketName;

    private String fileName;

    private boolean isEditable;

    private boolean isActive;
}
