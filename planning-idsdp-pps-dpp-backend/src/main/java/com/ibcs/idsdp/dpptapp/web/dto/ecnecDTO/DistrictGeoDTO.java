package com.ibcs.idsdp.dpptapp.web.dto.ecnecDTO;

import lombok.Data;

import java.util.List;


@Data
public class DistrictGeoDTO {
    private String name;
    private String geoCode;
    private List<UpazilaGeoDTO> upazila;
}
