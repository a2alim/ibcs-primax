package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_installment_process_upload_bill_voucher")
public class InstallmentProcessUploadBillVoucherFiles extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "m2_installment_process_id")
    private InstallmentProcess m2InstallmentProcessId;

    @Column(name = "file_title")
    private String fileTitle;

    @Column(name = "file_download_url",nullable = false)
    private String fileDownloadUrlSignature;

    @Column(name = "bucket_name")
    private String bucketNameSignature;

    @Column(name = "file_name")
    private String fileNameSignature;

    @Column(name = "is_editable")
    private Boolean isEditable;

}
