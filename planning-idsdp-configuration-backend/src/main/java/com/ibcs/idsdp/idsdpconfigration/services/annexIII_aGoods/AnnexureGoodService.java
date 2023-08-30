package com.ibcs.idsdp.idsdpconfigration.services.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import org.springframework.data.domain.Page;

public interface AnnexureGoodService {
    Page<AnnexureGoodsRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO);

    String generateCodeNumber(String code);

    AnnexureGoodsRequest saveWithChild(AnnexureGoodSaveWithChildRequest request);


}
