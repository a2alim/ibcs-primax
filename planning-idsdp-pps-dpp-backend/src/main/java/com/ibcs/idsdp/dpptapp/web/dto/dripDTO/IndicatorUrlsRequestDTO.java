package com.ibcs.idsdp.dpptapp.web.dto.dripDTO;

import lombok.Data;

import java.util.List;


@Data
public class IndicatorUrlsRequestDTO {
    private List<String> AdminCodeList;
    private List<Long> IndicatorList;
    private String ProjectName;
    private boolean isBangla;
}
