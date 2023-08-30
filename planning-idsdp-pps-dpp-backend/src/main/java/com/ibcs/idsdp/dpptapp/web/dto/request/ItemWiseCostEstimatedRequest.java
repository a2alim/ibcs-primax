package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemWiseCostEstimatedRequest {
    private String majorItem;
    private String description;
    private Long unit;
    private Double unitCost;
    private String basis;
    private String source;
    private LocalDate itemWiseCostDate;
    private UnitType unitType;
}
