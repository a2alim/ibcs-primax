package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import lombok.Data;


@Data
public class SearchRequestDTO {
    private String projectType;
    private String projectName;
    private Long sector;
    private Double lowAmount;
    private Double highAmount;
    private MovementStageEnum status;
    private PageableRequestBodyDTO pageable;
}
