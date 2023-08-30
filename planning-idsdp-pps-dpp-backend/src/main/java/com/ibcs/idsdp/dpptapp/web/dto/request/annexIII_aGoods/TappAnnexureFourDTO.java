package com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureFour;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsDetailsRequest;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class TappAnnexureFourDTO extends UuidIdHolderRequestBodyDTO {

    List<TappAnnexureFour> list;

}
