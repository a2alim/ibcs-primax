package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApiMessageResponse {
    private int statusCode;

    private String message;
}
