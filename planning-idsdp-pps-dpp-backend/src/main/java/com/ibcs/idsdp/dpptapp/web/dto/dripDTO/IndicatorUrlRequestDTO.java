package com.ibcs.idsdp.dpptapp.web.dto.dripDTO;

import lombok.Data;

import java.util.List;

@Data
public class IndicatorUrlRequestDTO {
    private String pcUuid;
    private List<Long> indicatorList;
    private String projectName;
    private boolean bangla;
}

