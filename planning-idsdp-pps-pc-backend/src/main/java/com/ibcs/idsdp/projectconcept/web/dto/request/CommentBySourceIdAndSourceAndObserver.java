package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import lombok.Data;

@Data
public class CommentBySourceIdAndSourceAndObserver {

    private Long sourceId;
    private SourceEnum source;
    private String observer;
}
