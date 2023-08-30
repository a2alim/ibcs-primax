package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import lombok.Data;


@Data
public class InstallmentProcessExpenditureItemsResponseDto extends UuidIdHolderRequestBodyDTO {
    private Long processId;
    private InstallmentProcess m2InstallmentProcessId;
    private Long stExpenditureItemId;
    private String purpose;
    private Double totalAmount;
    private Double expenseAmount;
    private Double receivableAmount;
    private Boolean isEditable;
}
