package com.ibcs.idsdp.web.dto;

import lombok.Data;

import java.util.List;


@Data
public class ResourcesFilterDTO {
    private List<String> categoryList;
    private List<String> yearList;
    private List<String> monthList;
}
