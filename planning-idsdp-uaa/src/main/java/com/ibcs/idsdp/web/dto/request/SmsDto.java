package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

/**
 * Created by : rakibul.hasan on 12/20/2021 12:04 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class SmsDto {
    private String number;
    private String message;
}
