package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CostOfMajorItemRequest {
    private String majorItem;
    private String description;
    private Long unit;
    private Double proposalProject;
    private String similarGoingProject;
    private String similarCompleteProject;
    private String remarks;
    private UnitType unitType;
}
