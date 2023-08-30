package com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class AnnexureGoodsRequest extends UuidIdHolderRequestBodyDTO {

    @NotNull
    private Double total;

    private Boolean status;

    @NotNull
    private String formType;

    List<AnnexureGoodsDetailsRequest> list;
}
