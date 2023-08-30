package com.ibcs.idsdp.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserTfaRequest {
    private Long userId;
    private boolean tfaEnabled;
}
