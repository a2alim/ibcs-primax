package com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FywSectorSubSectorResponse extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long fsFYwSectorSubSectorsId;
    private String letterFor;
    private String memorandumNo;
    private LocalDate advertisementStartDate;
    private LocalDate advertisementEndDate;
    private String paragraph1;
    private String paragraph2;
    private String newspaperForAd;
    private String nitimalaUrl;
    private String nitimalaYear;
    private String bucketName;
    private String fileName;
    private Boolean isEditable;

    private Long phdCatId;
    private Double phdCatBudgetAmount;
    private Long mphilCatId;
    private Double mphilCatBudgetAmount;
    private Long fellowCatId;
    private Double fellowCatBudgetAmount;
    private Long promoCatId;
    private Double promoCatBudgetAmount;
    private Long instCatId;
    private Double instCatBudgetAmount;

    private LocalDate tiApplicationStartDate;
    private LocalDate tiApplicationEndDate;
    private Double tiBudgetAmount;

    private Boolean isActive;
}
