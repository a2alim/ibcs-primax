package com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class YearWiseCostDto extends UuidIdHolderRequestBodyDTO {

    private Boolean isDeleted;
    private String createdBy;
    private LocalDate createdOn;
    private String projectUuid;
    private String fiscalYear;
    private Double gobApprovedDpp;
    private Double gobAdp;
    private Double developmentPartnerApprovedDpp;
    private Double developmentPartnerAdp;
    private Double ownFundApproveDpp;
    private Double ownFundAdp;
    private Double othersDpp;
    private Double totalDpp;
    private Double totalAdp;

}
