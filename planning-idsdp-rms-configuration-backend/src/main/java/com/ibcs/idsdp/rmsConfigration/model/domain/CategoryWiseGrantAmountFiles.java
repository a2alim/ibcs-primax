package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
//@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(name = "st_category_wise_grant_amount_files")
public class CategoryWiseGrantAmountFiles extends BaseEntity {

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name = "active", nullable = false)
    private Boolean active;



}
