package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class AgreementPartyResponseDto extends UuidIdHolderRequestBodyDTO {
    private Long agreementId;
    private AgreementWithResearcher agreementWithResearcherId;
    private Long firstPartyUserId;
    private Long rmsUserSignatureIdOfFirstParty;
    private Long firstPartyWitnessUserId;
    private Long rmsUserSignatureIdOfWitnessUser;
    private Long secondPartyUserId;
    private Long rmsUserSignatureIdOf2ndParty;

    private String secondPartyWitnessName;

    private String secondPartyWitnessDesignation;

    private String secondPartyWitnessAddress;

    private String secondPartyWitnessNid;

    private String secondPartyWitnessMobileNo;

    private String secondPartyWitnessEmail;

    private String fileDownloadUrlSignature;

    private String bucketNameSignature;

    private String fileNameSignature;

    private boolean isEditable;

    private String secondPartyWitnessTinNO;
}
