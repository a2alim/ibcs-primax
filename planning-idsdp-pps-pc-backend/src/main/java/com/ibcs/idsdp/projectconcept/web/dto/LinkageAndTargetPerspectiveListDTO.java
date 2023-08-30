package com.ibcs.idsdp.projectconcept.web.dto;

import lombok.Data;

@Data
public class LinkageAndTargetPerspectiveListDTO {
    private String goals;
    private String targets;
    private String indicator;
    private String type;
    private Long attachmentId;
    private String attachmentName;
    private Long projectConceptMasterId;
    private String uuid;
}
