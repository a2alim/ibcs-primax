package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TestResponse extends UuidIdHolderRequestBodyDTO {

    private String shortName;

}
