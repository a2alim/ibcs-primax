package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 10/3/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class CategoryWiseGrantAmountRequest extends UuidIdHolderRequestBodyDTO {

    private Long fiscalYearId;

    private Long researchCategoryTypeId;


    private Double budgetAllAmountPercent;

    private Double totalBudgetAllocationAmount;

    private Double minGrantAmount;

    private Double maxGrantAmount;

    private String budgetSource;

    private Boolean active;

  //  private List<CategoryWiseGrantAmountFilesRequest> categoryWiseGrantAmountFiles;
}
