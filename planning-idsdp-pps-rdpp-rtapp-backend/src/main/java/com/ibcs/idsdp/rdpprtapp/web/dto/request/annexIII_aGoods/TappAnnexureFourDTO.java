package com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureFour;
import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureFourDTO extends UuidIdHolderRequestBodyDTO {

    List<TappAnnexureFour> list;

}
