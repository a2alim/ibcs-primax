package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

import java.time.LocalDate;

/**
 * Created by : rakibul.hasan on 4/21/2022 2:10 PM
 * github : https://github.com/rhmtechno
 */
@Data
public class SessionDataResponse {
    private String sessionId;
    private String accessToken;
    private String doptorToken;
    private LocalDate creationTime;

}
