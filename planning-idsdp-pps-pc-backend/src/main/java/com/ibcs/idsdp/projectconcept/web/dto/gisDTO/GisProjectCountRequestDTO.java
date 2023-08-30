package com.ibcs.idsdp.projectconcept.web.dto.gisDTO;

import lombok.Data;


@Data
public class GisProjectCountRequestDTO {
    private String divisionGeoCode;
    private String zillaGeoCode;
    private String upazillaGeoCode;
    private String startDate;
    private String endDate;
    private Double lowAmount;
    private Double highAmount;
}
