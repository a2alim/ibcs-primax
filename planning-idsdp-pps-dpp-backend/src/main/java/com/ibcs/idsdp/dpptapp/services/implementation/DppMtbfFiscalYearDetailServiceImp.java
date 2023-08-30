package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.model.domain.DppMtbfFiscalYearDetail;
import com.ibcs.idsdp.dpptapp.model.repositories.DppMtbfFiscalYearDetailRepository;
import com.ibcs.idsdp.dpptapp.services.DppMtbfFiscalYearDetailService;
import com.ibcs.idsdp.dpptapp.web.dto.DppMtbfFiscalYearDetailDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DppMtbfFiscalYearDetailServiceImp extends BaseService<DppMtbfFiscalYearDetail, DppMtbfFiscalYearDetailDTO> implements DppMtbfFiscalYearDetailService {

    private final DppMtbfFiscalYearDetailRepository mtbfFiscalYearDetailRepository;

    public DppMtbfFiscalYearDetailServiceImp(DppMtbfFiscalYearDetailRepository mtbfFiscalYearDetailRepository) {
        super(mtbfFiscalYearDetailRepository);
        this.mtbfFiscalYearDetailRepository = mtbfFiscalYearDetailRepository;
    }


}


