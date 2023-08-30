package com.ibcs.idsdp.dpptapp.web.dto.pageable;

import lombok.Data;

import java.util.List;

@Data
public class PageableResponse {
    private List<?> content;
    private Pageable pageable;
    private long totalElements;
    private int totalPages;
    private boolean last;
    private int size;
    private int number;
    private int numberOfElements;
    private boolean first;
    private boolean empty;
}
