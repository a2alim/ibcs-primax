package com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO;

import lombok.Data;

import java.util.List;


@Data
public class DivisionGeoDTO {
    private String name;
    private String geoCode;
    private List<DistrictGeoDTO> district;
}
