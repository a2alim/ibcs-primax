package com.ibcs.idsdp.web.dto.request;

import lombok.Data;


@Data
public class SearchUserRequest {
    private String searchText;
    private Long ministryDivisionId;
    private Long agencyId;
    private PageableRequestBodyDTO pageable;
}
