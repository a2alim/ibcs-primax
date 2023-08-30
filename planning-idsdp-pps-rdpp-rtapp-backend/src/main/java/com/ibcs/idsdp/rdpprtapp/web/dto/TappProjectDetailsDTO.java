package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;

@Data
@EntityListeners(AuditingEntityListener.class)
public class TappProjectDetailsDTO extends UuidIdHolderRequestBodyDTO {
    private String situationAnalysis;
    private String objectives;
    private String specificDetails;
    private String visionMission;
    private String projectContribute;
    private String implementationArrangements;
    private String expectedOutputOutcome;
    private String monitoringEvaluationReporting;
    private String legalContext;
    private Integer status;
    private String message;

}
