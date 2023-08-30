package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class EffectImpactRequest extends UuidHolderRequestBodyDTO {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String otherProjectInstallations;
    private String envSustainabilityLand;
    private String futureDisasterManagement;
    private String genderDisabilityGroups;
    private String employment;
    private String provertySituation;
    private String organizationalArrangement;
    private String institutionalProductivity;
    private String regionalDisparity;
    private String population;
    private String whetherEnvironmentClearance;
    private String envClearenceAttachment;
}
