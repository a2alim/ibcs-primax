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
@Table(name = "m1_agreement_jamanatnama")
public class AgreementJamanatnama extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "m1_agreement_with_researcher_id")
    private AgreementWithResearcher agreementWithResearcherId;

    @Column(name = "file_download_url_image", nullable = false)
    private String fileDownloadUrlImage;

    @Column(name = "bucket_name_image", nullable = false)
    private String bucketNameImage;

    @Column(name = "file_name_image", nullable = false)
    private String fileNameImage;

    @Column(name = "guarantor_name", nullable = false)
    private String guarantorName;

    @Column(name = "fathers_name", nullable = false)
    private String fathersName;

    @Column(name = "mother_name", nullable = false)
    private String motherName;

    @Column(name = "tinNo")
    private String tinNo;

    @Column(name = "present_address", nullable = false)
    private String presentAddress;

    @Column(name = "permanent_address", nullable = false)
    private String permanentAddress;

    @Column(name = "email_address")
    private String emailAddress;

    @Column(name = " nid_number", nullable = false)
    private String nidNumber;

    @Column(name = " mobile_number")
    private String mobileNumber;

    @Column(name = " first_page",nullable = true ,columnDefinition = "TEXT")
    private String firstPage;

    @Column(name = " second_page", nullable = true, columnDefinition = "TEXT")
    private String secondPage;

    @Column(name = " third_page", columnDefinition = "TEXT")
    private String thirdPage;

    @Column(name = " fourth_page", columnDefinition = "TEXT")
    private String fourthPage;
    @Column(name = "file_download_url_signature", nullable = false)
    private String fileDownloadUrlSignature;

    @Column(name = "bucket_name_signature", nullable = false)
    private String bucketNameSignature;

    @Column(name = "file_name_signature", nullable = false)
    private String fileNameSignature;

    @Column(name = "is_editable")
    private boolean isEditable;
    
    @Column(name = "refund_period")
    private Long refundPeriod;
    
    
    


}
