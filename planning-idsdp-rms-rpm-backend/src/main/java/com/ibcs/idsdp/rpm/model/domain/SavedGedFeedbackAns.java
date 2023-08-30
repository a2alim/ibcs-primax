package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m1_saved_ged_feedback_ans")
public class SavedGedFeedbackAns extends BaseEntity {
    @Column(name = "st_fiscal_year_id", nullable = false, length = 20)
    private long stFiscalYearId;

    @Column(name = "person_name", nullable = false)
    private String personName;

    @Column(name = "designation", nullable = false)
    private String designation;

    @Column(name = "mobile_no", nullable = false)
    private String mobileNo;

    @Column(name = "file_download_url")
    private String fileDownloadUrl;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "email_address", nullable = false)
    private String emailAddress;

    @Transient
    private String mode;
}
