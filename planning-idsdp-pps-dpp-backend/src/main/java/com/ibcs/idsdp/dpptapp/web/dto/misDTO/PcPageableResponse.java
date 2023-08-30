package com.ibcs.idsdp.dpptapp.web.dto.misDTO;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.web.dto.pageable.Pageable;
import lombok.Data;

import java.util.List;

@Data
public class PcPageableResponse {
    private List<ProjectConceptResponse> content;
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
