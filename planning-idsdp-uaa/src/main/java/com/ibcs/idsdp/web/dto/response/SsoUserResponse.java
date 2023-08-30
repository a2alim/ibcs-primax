package com.ibcs.idsdp.web.dto.response;

import com.ibcs.idsdp.model.domain.UserData;
import lombok.Data;

@Data
public class SsoUserResponse {
    private UserData data;
}
