package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

/**
 * Created by : rakibul.hasan on 3/13/2022 2:34 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class ResetPayload {
    private String userId;
    private String validity;
}
