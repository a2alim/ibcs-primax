package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_installment_process_expenditure_items")
public class InstallmentProcessExpenditureItems extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "m2_installment_process_id")
    private InstallmentProcess m2InstallmentProcessId;

    @Column(name = "st_expenditure_item_id", nullable = false)
    private Long stExpenditureItemId;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "expense_amount")
    private Double expenseAmount;

    @Column(name = "receivable_amount")
    private Double receivableAmount;

    @Column(name = "is_editable")
    private Boolean isEditable;
    @Transient
    private String expenditureItemName;


}
