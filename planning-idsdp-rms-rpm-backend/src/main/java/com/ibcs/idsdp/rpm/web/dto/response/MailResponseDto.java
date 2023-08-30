package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by : rakibul.hasan on 12/9/2021 12:09 PM
 * github : https://github.com/rhmtechno
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailResponseDto {
    private String message;
    private boolean status;
}
