package com.ibcs.idsdp.trainninginstitute.web.dto.response;


import lombok.*;

@Data
public class ProposalListResponse {
    private Long id;
    private String uuid;
    private String trainingName;
    private String instituteName;
    private Long fiscalYearId;
}
