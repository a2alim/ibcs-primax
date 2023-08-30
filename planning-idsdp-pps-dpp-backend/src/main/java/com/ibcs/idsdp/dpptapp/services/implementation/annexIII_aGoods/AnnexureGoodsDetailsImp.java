package com.ibcs.idsdp.dpptapp.services.implementation.annexIII_aGoods;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.dpptapp.model.repositories.annexIII_aGoods.AnnexureGoodsDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.annexIII_aGoods.AnnexureGoodsRepository;
import com.ibcs.idsdp.dpptapp.services.annexIII_aGoods.AnnexureGoodsDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProcurementMethod;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProcurementType;
import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnnexureGoodsDetailsImp extends BaseService<AnnexureGoodsDetails, AnnexureGoodsDetailsRequest> implements AnnexureGoodsDetailsService {

    private final AnnexureGoodsDetailsRepository repository;
    private final AnnexureGoodsRepository annexureGoodsRepository;
    private final ConfigurationClientService configurationClientService;

    public AnnexureGoodsDetailsImp(AnnexureGoodsDetailsRepository repository, AnnexureGoodsRepository annexureGoodsRepository, ConfigurationClientService configurationClientService) {
        super(repository);
        this.repository = repository;
        this.annexureGoodsRepository = annexureGoodsRepository;
        this.configurationClientService = configurationClientService;
    }

    @Override
    protected AnnexureGoodsDetails convertForCreate(AnnexureGoodsDetailsRequest annexureGoodsDetailsRequest) {
        AnnexureGoodsDetails request = super.convertForCreate(annexureGoodsDetailsRequest);
        request.setAnnexureGoods(annexureGoodsRepository.findByIdAndIsDeleted(annexureGoodsDetailsRequest.getAnnexureGoodsId(), false).get());
        return request;
    }

    public List<AnnexureGoodsDetailsRequest> getDetailListById(Long id) {
        List<AnnexureGoodsDetails> annexureGoodsDetails = repository.findAllByAnnexureGoodsIdAndIsDeletedOrderByIdAsc(id, false);
        List<AnnexureGoodsDetailsRequest> list = convertForRead(annexureGoodsDetails);
        return setDTO(list);
    }

    public List<AnnexureGoodsDetailsRequest> setDTO(List<AnnexureGoodsDetailsRequest> list) {
        Map<Long, UnitType> unitTypeHashMap = configurationClientService.getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
            {
                setIds(list.stream().map(AnnexureGoodsDetailsRequest::getUnitId).collect(Collectors.toSet()));
            }
        }).stream().collect(Collectors.toMap(UnitType::getId, a -> a));

        Map<Long, ProcurementMethod> procurementMethodHashMap = configurationClientService.getProcurementMethodByIdSet(new IdSetRequestBodyDTO() {
            {
                setIds(list.stream().map(AnnexureGoodsDetailsRequest::getProcurementMethodId).collect(Collectors.toSet()));
            }
        }).stream().collect(Collectors.toMap(ProcurementMethod::getId, a -> a));

        Map<Long, ProcurementType> procurementTypeHashMap = configurationClientService.getProcurementTypeByIdSet(new IdSetRequestBodyDTO() {
            {
                setIds(list.stream().map(AnnexureGoodsDetailsRequest::getProcurementTypeId).collect(Collectors.toSet()));
            }
        }).stream().collect(Collectors.toMap(ProcurementType::getId, a -> a));

        list.forEach(e -> {
            e.setUnitTypeDTO(unitTypeHashMap.get(e.getUnitId()));
            e.setProcurementMethod(procurementMethodHashMap.get(e.getProcurementMethodId()));
            e.setProcurementType(procurementTypeHashMap.get(e.getProcurementTypeId()));
        });

        return list;
    }
}
