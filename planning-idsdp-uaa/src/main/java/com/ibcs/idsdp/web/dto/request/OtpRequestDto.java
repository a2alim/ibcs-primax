package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

/**
 * Created by : rakibul.hasan on 12/26/2021 3:07 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class OtpRequestDto {
    private Integer otp;
    private Long userId;
}
