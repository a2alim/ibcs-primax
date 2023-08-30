package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

import javax.persistence.Transient;
import java.time.LocalDate;

@Data
public class ApprovedDppTappResponseDto {
    private  String uuid;
    private Long id;
    private String projectTitleEn;
    private String projectTitleBn;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private LocalDate expCommencementDate;
    private LocalDate expCompletionDate;
    private String dppTappType;
    private Long referenceId;
    private String referenceUuid;
}
