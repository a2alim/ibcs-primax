package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import io.swagger.models.auth.In;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompletionReportResponse {

    private Long id;

    private Long fiscalYearId;

    private String instituteName;

    private Integer totalParticipants;

    private Integer totalSessions;

    private Integer duration;

    private Boolean isFinalSubmitted;
}
