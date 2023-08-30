package com.ibcs.idsdp.projectconcept.web.dto.request;

import lombok.Data;

@Data
public class SearchWithPageableRequest {

    private String value;

    private Integer page;

    private Integer size;


}
