package com.ibcs.idsdp.idsdpconfigration.web.controller.annexIII_aGoods;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.model.domain.annexIII_aGoods.AnnexureGoods;
import com.ibcs.idsdp.idsdpconfigration.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping("/annexure-goods")
public class AnnexureGoodsController extends BaseController<AnnexureGoods, AnnexureGoodsRequest> {

    public final AnnexureGoodService annexureGoodService;

    public AnnexureGoodsController(BaseService<AnnexureGoods, AnnexureGoodsRequest> baseService, AnnexureGoodService annexureGoodService){
        super(baseService);
        this.annexureGoodService = annexureGoodService;
    }

    @PostMapping(path= "save" , produces = "application/json")
    public AnnexureGoodsRequest crateWithChild(@RequestBody AnnexureGoodSaveWithChildRequest request) {
        return annexureGoodService.saveWithChild(request);
    }
}

