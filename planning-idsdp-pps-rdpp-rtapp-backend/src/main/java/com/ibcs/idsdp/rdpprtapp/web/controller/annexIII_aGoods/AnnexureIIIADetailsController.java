package com.ibcs.idsdp.rdpprtapp.web.controller.annexIII_aGoods;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.services.annexIII_aGoods.AnnexureGoodsDetailsService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping("ss")
public class AnnexureIIIADetailsController extends BaseController<AnnexureGoodsDetails, AnnexureGoodsDetailsRequest> {

    private final AnnexureGoodsDetailsService annexureGoodsDetailsService;

    /**
     * Constructor of AnnexureIIIADetailsController class
     * @param baseService
     * @param annexureGoodsDetailsService
     */
    public AnnexureIIIADetailsController(BaseService<AnnexureGoodsDetails, AnnexureGoodsDetailsRequest> baseService, AnnexureGoodsDetailsService annexureGoodsDetailsService) {
        super(baseService);
        this.annexureGoodsDetailsService = annexureGoodsDetailsService;
    }
}