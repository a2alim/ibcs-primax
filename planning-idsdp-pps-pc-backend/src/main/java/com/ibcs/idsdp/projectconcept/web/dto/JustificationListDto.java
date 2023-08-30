package com.ibcs.idsdp.projectconcept.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;


@Data
public class JustificationListDto {
    private Long attachmentId;
    private String attachmentName;
    private String description;
    private Long justification;
    private Long projectConceptMasterId;
    private String uuid;

}
