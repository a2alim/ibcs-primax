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
@Table(name = "m1_create_letter_for_ged")
public class CreateLetterForGed extends BaseEntity {
    @Column(name = "st_fiscal_year_id", nullable = false, length = 20)
    private long stFiscalYearId;

    @Column(name = "send_to", nullable = false)
    private String sendTo;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "letter_body_content", nullable = false, columnDefinition = "TEXT")
    private String letterBodyContent;

    @Column(name = "file_download_url")
    private String fileDownloadUrl;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "sending_status", nullable = false, length = 20, columnDefinition = "integer default 1")
    private Integer sendingStatus;

    @Transient
    private String mode;
}
