package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.projectconcept.client.dto.response.AnnexureAmountDTO;
import lombok.Data;

import java.time.LocalDate;


@Data
public class AmsUnapprovedProjectRequestDTO {
    private Long ppsId;
    private Long amsId;
    private String datasource;
    private String projectName;
    private String projectNameBn;
    private String ministryCode;
    private String agencyCode;
    private String adpSectorCode;
    private String adpSubSectorCode;
    private LocalDate dateOfCommencement;
    private LocalDate dateOfCompletion;
    private Integer projectType;
    private String projectObjectives;
    private String projectObjectivesBn;
    private String environmentCategoryCode;
    private boolean isEcaRequired;
    private String descriptionEca;
    private boolean isEiaRequired;
    private String descriptionEia;
    private boolean isForeignAid;
    private AnnexureAmountDTO estimatedCost;
}
