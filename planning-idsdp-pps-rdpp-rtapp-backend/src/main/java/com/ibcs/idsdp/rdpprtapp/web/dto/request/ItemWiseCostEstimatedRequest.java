package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.UnitType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemWiseCostEstimatedRequest {
    private String majorItem;
    private Long unit;
    private Double unitCost;
    private String basis;
    private String source;
    private LocalDate itemWiseCostDate;
    private UnitType unitType;
}
