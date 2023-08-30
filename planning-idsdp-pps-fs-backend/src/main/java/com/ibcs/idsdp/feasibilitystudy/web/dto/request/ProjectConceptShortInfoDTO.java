package com.ibcs.idsdp.feasibilitystudy.web.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectConceptShortInfoDTO {
    private String pcUuid;
    private String titleEn;
    private String titleBn;
    private LocalDate commencementDate;
    private LocalDate completionDate;
    private Long sectorDivisionId;
    private Long sectorId;
    private Long subSectorId;
}
