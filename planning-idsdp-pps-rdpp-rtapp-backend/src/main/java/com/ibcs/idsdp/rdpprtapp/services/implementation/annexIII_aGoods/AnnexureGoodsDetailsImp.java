package com.ibcs.idsdp.rdpprtapp.services.implementation.annexIII_aGoods;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.model.repositories.annexIII_aGoods.AnnexureGoodsDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.annexIII_aGoods.AnnexureGoodsRepository;
import com.ibcs.idsdp.rdpprtapp.services.annexIII_aGoods.AnnexureGoodsDetailsService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnnexureGoodsDetailsImp extends BaseService<AnnexureGoodsDetails, AnnexureGoodsDetailsRequest> implements AnnexureGoodsDetailsService {

    private final AnnexureGoodsDetailsRepository repository;
    private final AnnexureGoodsRepository annexureGoodsRepository;

    public AnnexureGoodsDetailsImp(AnnexureGoodsDetailsRepository repository, AnnexureGoodsRepository annexureGoodsRepository) {
        super(repository);
        this.repository = repository;
        this.annexureGoodsRepository = annexureGoodsRepository;
    }

    @Override
    protected AnnexureGoodsDetails convertForCreate(AnnexureGoodsDetailsRequest annexureGoodsDetailsRequest) {
        AnnexureGoodsDetails request = super.convertForCreate(annexureGoodsDetailsRequest);
        request.setAnnexureGoods(annexureGoodsRepository.findByIdAndIsDeleted(annexureGoodsDetailsRequest.getAnnexureGoodsId(), false).get());
        return request;
    }
}
