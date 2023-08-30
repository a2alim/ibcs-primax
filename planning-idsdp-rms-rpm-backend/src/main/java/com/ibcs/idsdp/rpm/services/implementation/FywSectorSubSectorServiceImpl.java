package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSector;
import com.ibcs.idsdp.rpm.model.repositories.FywSectorSubSectorRepository;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorService;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorRequestDTO;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FywSectorSubSectorServiceImpl extends BaseService<FywSectorSubSector, FywSectorSubSectorRequestDTO, FywSectorSubSectorResponse> implements FywSectorSubSectorService {

    private final FywSectorSubSectorRepository fywSectorSubSectorRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;

    public FywSectorSubSectorServiceImpl(ServiceRepository<FywSectorSubSector> repository,
                                         FywSectorSubSectorRepository fywSectorSubSectorRepository,
                                         RmsConfigurationClientService rmsConfigurationClientService) {
        super(repository);
        this.fywSectorSubSectorRepository = fywSectorSubSectorRepository;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
    }

    @Override
    public Response<FywSectorSubSectorResponse> dataSave(FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO) {

        long countVal = fywSectorSubSectorRepository.countByStFiscalYearIdAndLetterForAndIsDeleted(fywSectorSubSectorRequestDTO.getStFiscalYearId(), fywSectorSubSectorRequestDTO.getLetterFor(), false);

        if (countVal < 1) {
            Response<FywSectorSubSectorResponse> fywSectorSubSectorResponseResponse = create(fywSectorSubSectorRequestDTO);

            if (fywSectorSubSectorResponseResponse.isSuccess()) {
                Long id = fywSectorSubSectorResponseResponse.getObj().getId();
                fywSectorSubSectorRepository.inactiveAllPrevious(false, id);
            }
            return fywSectorSubSectorResponseResponse;
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FywSectorSubSectorResponse> dataUpdate(FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO) {
        Optional<FywSectorSubSector> val = fywSectorSubSectorRepository.findByUuidAndIsDeleted(fywSectorSubSectorRequestDTO.getUuid(), false);
        if (val.isPresent()) {
            //|| fywSectorSubSectorRequestDTO.getUuid().equals(val.get().getUuid())
            //return update(fywSectorSubSectorRequestDTO);
            if (fywSectorSubSectorRequestDTO.getLetterFor().equals(val.get().getLetterFor())) {
                return update(fywSectorSubSectorRequestDTO);
            } else {
                long countVal = fywSectorSubSectorRepository.countByStFiscalYearIdAndLetterForAndIsDeleted(fywSectorSubSectorRequestDTO.getStFiscalYearId(), fywSectorSubSectorRequestDTO.getLetterFor(), false);
                if (countVal < 1) {
                    return update(fywSectorSubSectorRequestDTO);
                }
                return getErrorResponse("Already Exist!.");
            }
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public ResponseEntity<List<FywSectorSubSector>> findAllByActiveData(Integer typeNo) {
        return new ResponseEntity(fywSectorSubSectorRepository.findAllByIsDeleted(false), HttpStatus.OK);
    }

    public ResponseEntity<FywSectorSubSectorResponse> getDataByUuid(String uuid, Boolean isDelete) {
        Optional<FywSectorSubSector> val = fywSectorSubSectorRepository.findByUuidAndIsDeleted(uuid, isDelete);
        if (val.isPresent()) {
            return new ResponseEntity(val.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity(val.get(), HttpStatus.OK);
        }
    }

    public Response<FywSectorSubSector> getDataByFiscalYearWise(Long fiscalYearId, Boolean isDelete) {
        List<FywSectorSubSector> fywSectorSubSectors = fywSectorSubSectorRepository.findAllByStFiscalYearIdAndIsDeleted(fiscalYearId, isDelete);
        if (fywSectorSubSectors != null) {
            return new Response<>() {{
                setSuccess(true);
                setItems(fywSectorSubSectors);
            }};
        } else {
            return new Response<>() {{
                setSuccess(false);
            }};
        }

    }

    @Override
    public BooleanValueHolderDTO doCheckValidity() {

        LocalDate date = LocalDate.now();

        FywSectorSubSector data = fywSectorSubSectorRepository.isValid(date, date);

        if (data == null) {
            return new BooleanValueHolderDTO() {{
                setSuccess(false);
                setMessage("Sorry! Currently we have no open research circular. Please try again later.");
            }};
        }
        return new BooleanValueHolderDTO() {{
            setSuccess(true);
            setMessage("Scope Available for Proposal");
            setAdvertisementStartDate(data.getAdvertisementStartDate());
            setAdvertisementEndDate(data.getAdvertisementEndDate());
            setStFiscalYearId(data.getStFiscalYearId());
        }};

    }

    @Override
    public Response<FiscalResponseDto> getAllFiscalYearByFinalCopy() {
        List<FiscalResponseDto> fiscalResponseDtosList = new ArrayList<>();
        Response<FiscalResponseDto> response = new Response<>();
        try {
            List<FywSectorSubSector> fywSectorSubSectors = fywSectorSubSectorRepository.findAllByLetterForAndIsActiveAndIsDeleted("Final Copy", true, false);
            fywSectorSubSectors.forEach(res -> {
                Response<FiscalResponseDto> fiscalResponseDtoResponse = rmsConfigurationClientService.getByFiscalYearId(res.getStFiscalYearId());
                fiscalResponseDtosList.add(fiscalResponseDtoResponse.getObj());

            });
            response.setMessage("Fiscal Year ");
            response.setItems(fiscalResponseDtosList);
            response.setSuccess(true);
        } catch (Exception ex) {
            response.setMessage("Something wrong!!");
            response.setItems(fiscalResponseDtosList);
            response.setSuccess(false);
        }
        return response;
    }

    @Override
    public FywSectorSubSectorResponse getFiscalData() {
        FywSectorSubSector data = fywSectorSubSectorRepository.getFiscalYearData();
        FywSectorSubSectorResponse fywSectorSubSectorResponse = super.convertForRead(data);
        return fywSectorSubSectorResponse;
    }
}
