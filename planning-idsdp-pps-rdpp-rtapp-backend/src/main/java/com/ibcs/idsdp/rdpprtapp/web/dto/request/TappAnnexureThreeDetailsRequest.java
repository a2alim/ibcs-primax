package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import lombok.Data;

@Data
public class TappAnnexureThreeDetailsRequest {

    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String consultants;
    private String educationalQualification;
    private String experience;
    private String responsibilities;
    private String uuid;
}
