package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortLocationWiseBreakdownDTO {
    private String divisionGeoCode;
    private String zillaGeoCode;
    private String upazilaGeoCode;
    private String description;
    private Double estimatedCost;
    private String comment;
}
