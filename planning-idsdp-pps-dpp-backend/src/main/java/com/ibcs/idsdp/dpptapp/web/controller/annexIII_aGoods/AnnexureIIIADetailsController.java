package com.ibcs.idsdp.dpptapp.web.controller.annexIII_aGoods;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.dpptapp.services.annexIII_aGoods.AnnexureGoodsDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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