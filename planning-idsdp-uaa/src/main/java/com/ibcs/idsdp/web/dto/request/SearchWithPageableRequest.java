package com.ibcs.idsdp.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
public class SearchWithPageableRequest {

    private String value;

    private Integer page;

    private Integer size;


}
