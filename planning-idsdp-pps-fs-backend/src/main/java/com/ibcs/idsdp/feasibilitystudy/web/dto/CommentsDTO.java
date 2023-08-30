package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CommentsDTO extends UuidIdHolderRequestBodyDTO {

    private Long fspMasterId;

    private String comment;

    private String observer;

    private String commentBy;

    private LocalDate commentOn;
}
