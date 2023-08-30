package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class InstallmentProcessExpenditureItemsRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long processId;
    private InstallmentProcess m2InstallmentProcessId;
    private Long stExpenditureItemId;
    private String purpose;
    private Double totalAmount;
    private Double expenseAmount;
    private Double receivableAmount;
    private Boolean isEditable;

}
