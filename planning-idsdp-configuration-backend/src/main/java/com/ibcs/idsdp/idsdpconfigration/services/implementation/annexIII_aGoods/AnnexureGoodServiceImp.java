package com.ibcs.idsdp.idsdpconfigration.services.implementation.annexIII_aGoods;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.annexIII_aGoods.AnnexureGoods;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.annexIII_aGoods.AnnexureGoodsRepository;
import com.ibcs.idsdp.idsdpconfigration.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnnexureGoodServiceImp extends BaseService<AnnexureGoods, AnnexureGoodsRequest> implements AnnexureGoodService {

    private final AnnexureGoodsRepository annexureGoodsRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final AnnexureGoodsDetailsImp annexureGoodsDetailsImp;

    public AnnexureGoodServiceImp(AnnexureGoodsRepository annexureGoodsRepository, IdGeneratorComponent idGeneratorComponent, AnnexureGoodsDetailsImp annexureGoodsDetailsImp) {
        super(annexureGoodsRepository);
        this.annexureGoodsRepository = annexureGoodsRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.annexureGoodsDetailsImp = annexureGoodsDetailsImp;
    }


    @Override
    public Page<AnnexureGoodsRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<AnnexureGoods> ePage2 = annexureGoodsRepository.findAllByStatusAndIsDeleted(true, true, pageable);
        return new PageImpl(convertForRead(ePage2.getContent()), pageable, ePage2.getTotalElements());
    }

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = annexureGoodsRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

    @Override
    public AnnexureGoodsRequest saveWithChild(AnnexureGoodSaveWithChildRequest request) {

        System.out.println("=====================");
        System.out.println(request);
        System.out.println("++++++++++++++");

        AnnexureGoodsRequest annexureGoodsRequest = create(new AnnexureGoodsRequest() {{
            setTotal(request.getTotal());
            setStatus(true);
            setFormType(request.getFormType());
        }});

        List<AnnexureGoodsDetailsRequest> list = request.getList().stream().map(e -> {
            e.setAnnexureGoodsId(annexureGoodsRequest.getId());
            return annexureGoodsDetailsImp.create(e);
        }).collect(Collectors.toList());

        annexureGoodsRequest.setList(list);

        return annexureGoodsRequest;
    }
}
