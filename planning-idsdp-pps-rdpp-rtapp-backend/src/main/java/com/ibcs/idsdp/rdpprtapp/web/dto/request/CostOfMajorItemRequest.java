package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.UnitType;
import lombok.Data;

@Data
public class CostOfMajorItemRequest {
    private String majorItem;
    private Long unit;
    private Double proposalProject;
    private String similarGoingProject;
    private String similarCompleteProject;
    private String remarks;
    private UnitType unitType;
}
