package com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class AnnexureGoodSaveWithChildRequest {

    @NotNull
    private Double total;

    @NotNull
    private String formType;

    @NotEmpty
    private List<AnnexureGoodsDetailsRequest> list;
}
