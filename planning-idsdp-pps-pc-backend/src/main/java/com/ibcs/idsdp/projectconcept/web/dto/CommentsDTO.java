package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.UserResponse;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Setter
@Getter
public class CommentsDTO extends UuidIdHolderRequestBodyDTO {

    @NotNull
    private Long sourceId;

    @NotNull
    private SourceEnum commentsSource;

    @NotBlank
    private String comment;

    @NotBlank
    private String observer;

    private Long commentBy;

    private LocalDate commentOn;

    private UserResponse commenter;

    private boolean canEdit;
}
