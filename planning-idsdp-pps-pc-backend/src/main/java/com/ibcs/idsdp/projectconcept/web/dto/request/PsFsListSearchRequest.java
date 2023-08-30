package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import lombok.Data;


@Data
public class PsFsListSearchRequest {
    private PageableRequestBodyDTO pageableRequestBodyDTO;
    private Long projectType;
    private Long sectorDivision;
    private Boolean gob;
    private Boolean isForeignAid;
    private Boolean isFsRequired;
    private String projectName;
    private Long sector;
    private Double lowAmount;
    private Double highAmount;
    private MovementStageEnum status;
    private SourceEnum source;
    private String startDate;
    private String endDate;
//    private MovementStageEnum status;

}
