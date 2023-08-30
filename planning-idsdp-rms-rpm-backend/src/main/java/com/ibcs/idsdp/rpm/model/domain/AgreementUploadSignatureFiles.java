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
@Table(name = "m1_agreement_upload_signature_files")
public class AgreementUploadSignatureFiles extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "m1_agreement_with_researcher_id")
    private AgreementWithResearcher agreementWithResearcherId;

    @Column(name = "file_title")
    private String fileTitle;

    @Column(name = "file_download_url",nullable = false)
    private String fileDownloadUrlSignature;

    @Column(name = "bucket_name")
    private String bucketNameSignature;

    @Column(name = "file_name")
    private String fileNameSignature;

    @Column(name = "is_editable")
    private boolean isEditable;

}
