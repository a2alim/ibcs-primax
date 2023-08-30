package com.ibcs.idsdp.projectconcept.web.dto.pageable;

import lombok.Data;

@Data
public class Pageable {
    private int pageNumber;
    private int pageSize;
    private long offset;
    private boolean paged;
    private boolean unpaged;
}
