package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CommitteeDTO extends UuidIdHolderRequestBodyDTO {

    private String committeeName;
    private String description;
    private LocalDate dateOfFormation;
    private Long attachmentId;
    private Long fspMasterId;
    private List<MemberDTO> members;
}
