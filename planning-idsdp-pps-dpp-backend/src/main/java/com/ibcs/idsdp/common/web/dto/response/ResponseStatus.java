package com.ibcs.idsdp.common.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Null;

@Setter
@Getter
@AllArgsConstructor
public class ResponseStatus  {
    private Integer status;
    private String message;
}
