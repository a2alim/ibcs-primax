package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSectorSection;
import com.ibcs.idsdp.rpm.model.repositories.FywSectorSubSectorSectionRepository;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorSectionService;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorSectionRequest;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorSectionResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FywSectorSubSectorSectionServiceImpl extends BaseService<FywSectorSubSectorSection, FywSectorSubSectorSectionRequest, FywSectorSubSectorSectionResponse> implements FywSectorSubSectorSectionService {

    private final FywSectorSubSectorSectionRepository fywSectorSubSectorSectionRepository;

    public FywSectorSubSectorSectionServiceImpl(ServiceRepository<FywSectorSubSectorSection> repository, FywSectorSubSectorSectionRepository fywSectorSubSectorSectionRepository) {
        super(repository);
        this.fywSectorSubSectorSectionRepository = fywSectorSubSectorSectionRepository;
    }

    @Override
    public Response<FywSectorSubSectorSectionResponse> dataSave(FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest) {
        //return create(fywSectorSubSectorSectionRequest);

        long countVal = fywSectorSubSectorSectionRepository.countByStFiscalYearIdAndStSectorTypeIdAndIsDeleted(fywSectorSubSectorSectionRequest.getStFiscalYearId(), fywSectorSubSectorSectionRequest.getStSectorTypeId(), false);
        if (countVal < 1) {
            return create(fywSectorSubSectorSectionRequest);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FywSectorSubSectorSectionResponse> dataUpdate(FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest) {
        Optional<FywSectorSubSectorSection> val = fywSectorSubSectorSectionRepository.findByUuidAndIsDeleted (fywSectorSubSectorSectionRequest.getUuid(), false);

        if (!val.isPresent() || fywSectorSubSectorSectionRequest.getUuid().equals(val.get().getUuid())) {
            if(fywSectorSubSectorSectionRequest.getStSectorTypeId() == val.get().getStSectorTypeId()){
                return update(fywSectorSubSectorSectionRequest);
            }
            else
            {
                long countVal = fywSectorSubSectorSectionRepository.countByStFiscalYearIdAndStSectorTypeIdAndIsDeleted(fywSectorSubSectorSectionRequest.getStFiscalYearId(), fywSectorSubSectorSectionRequest.getStSectorTypeId(), false);
                if (countVal < 1) {
                    return update(fywSectorSubSectorSectionRequest);
                }
                return getErrorResponse("Already Exist!.");
            }
        }
        return getErrorResponse("Already Exist!.");
    }

    public ResponseEntity<List<FywSectorSubSectorSection>> findAllByIsDeleted() {
        return new ResponseEntity(fywSectorSubSectorSectionRepository.findAllByIsDeleted(false), HttpStatus.OK);
    }

    public Response<FywSectorSubSectorSection> getFywSectorSubSector(Long fiscalYearid, Boolean isDelete){
        List<FywSectorSubSectorSection> fywSectorSubSectorSection =  fywSectorSubSectorSectionRepository.findByStFiscalYearIdAndIsDeleted(fiscalYearid, isDelete);

        if(fywSectorSubSectorSection != null){
            return new Response<>(){{
                setSuccess(true);
                setMessage("Data Found");
                setItems(fywSectorSubSectorSection);
            }};
        }
        else
        {
            return new Response<>(){{
                setSuccess(false);
            }};
        }


    }
}
