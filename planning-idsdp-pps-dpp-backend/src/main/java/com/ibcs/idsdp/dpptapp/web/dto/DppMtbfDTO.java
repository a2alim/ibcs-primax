package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppMtbfDTO extends UuidIdHolderRequestBodyDTO {
    private Long projectConceptId;
    private String projectConceptUuid;
    private Integer numberOfOngoingProject;
    private Double costOfApprovedProject;
    private Double cumulativeExpenditure;
    private Double allocationRequiredForOngoingProject;
    private Double allocationInCurrentFiscalYear;
    private Integer numberOfApprovedProject;
    private Integer numberOfRecommendedProject;
    private String wayOfFinancing;

    List<DppMtbfFiscalYearDetailDTO> mtbfFiscalYearDetailList;
}
