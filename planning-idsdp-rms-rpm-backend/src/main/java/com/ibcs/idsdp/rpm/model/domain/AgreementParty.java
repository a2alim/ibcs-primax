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
@Table(name = "m1_agreement_party")
public class AgreementParty extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "m1_agreement_with_researcher_id")
    private AgreementWithResearcher agreementWithResearcherId;

    @Column(name = "first_party_user_id")
    private Long firstPartyUserId;

    /**
     * rms_user_signature_id_ofFirstParty this id find by login id and userType will be e-Nothi from user table
     **/

    @Column(name = "rms_user_signature_id_ofFirstParty")
    private Long rmsUserSignatureIdOfFirstParty;

    @Column(name = "first_party_witness_user_id")
    private Long firstPartyWitnessUserId;

    /**
     * rms_user_signature_id_ofWitnessUser this id find by first_party_witness_user_id
     **/

    @Column(name = "rms_user_signature_id_ofWitnessUser")
    private Long rmsUserSignatureIdOfWitnessUser;

    @Column(name = "second_party_user_id", nullable = false)
    private Long secondPartyUserId;

    /**
     * Find rms_user_signature_id_of2ndParty by created_by id of m1_researcher_profile_personal_info_id table
     **/

    @Column(name = "rms_user_signature_id_of2ndParty")
    private Long rmsUserSignatureIdOf2ndParty;

    @Column(name = "second_party_witness_name", nullable = false)
    private String secondPartyWitnessName;

    @Column(name = "second_party_witness_designation")
    private String secondPartyWitnessDesignation;

    @Column(name = "second_party_witness_address", nullable = false)
    private String secondPartyWitnessAddress;

    @Column(name = "second_party_witness_nid")
    private String secondPartyWitnessNid;

    @Column(name = "second_party_witness_mobile_no")
    private String secondPartyWitnessMobileNo;

    @Column(name = "second_party_witness_email")
    private String secondPartyWitnessEmail;

    @Column(name = "file_download_url_witness_signature")
    private String fileDownloadUrlSignature;

    @Column(name = "bucket_name_witness_signature")
    private String bucketNameSignature;

    @Column(name = "file_name_witness_signature")
    private String fileNameSignature;

    @Column(name = "is_editable")
    private boolean isEditable;

    @Transient
    private String firstPartyUser;

    @Transient
    private String firstPartyWitnessUser;

    @Transient
    private String secondPartyUser;
    @Column(name = "second_party_witness_tin_n_o")
    private String secondPartyWitnessTinNO;

}
