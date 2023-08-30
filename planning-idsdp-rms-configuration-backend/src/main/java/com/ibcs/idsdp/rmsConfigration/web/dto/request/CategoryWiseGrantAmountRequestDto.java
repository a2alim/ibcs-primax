package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import lombok.Data;
import lombok.NonNull;

import java.util.List;

@Data
public class CategoryWiseGrantAmountRequestDto extends UuidIdHolderRequestBodyDTO {


    private Long fiscalYearWiseBudgetId;
    private Long researchCategoryTypeId;
    private Double budgetAllAmountPercent;
    private Double totalBudgetAllocationAmount;
    private Double minGrantAmount;
    private Double maxGrantAmount;
    private String budgetSource;
    private Boolean active;
    private List<CategoryWiseGrantAmountFilesRequestDto> categoryWiseGrantAmountFiles;
}
