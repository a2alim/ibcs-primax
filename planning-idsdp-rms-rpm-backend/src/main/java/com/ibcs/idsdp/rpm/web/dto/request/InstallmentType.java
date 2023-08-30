package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

/**
 * Created by : rakibul.hasan on 12/2/2021 5:06 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class InstallmentType {
    Long id;
    String installment;
    Integer percentage;
    Double amount;
}
