package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSector;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorRequestDTO;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface FywSectorSubSectorService {
    Response<FywSectorSubSectorResponse> dataSave(FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO);
    Response<FywSectorSubSectorResponse> dataUpdate(FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO);

    ResponseEntity<List<FywSectorSubSector>> findAllByActiveData(Integer typeNo);

    ResponseEntity<FywSectorSubSectorResponse> getDataByUuid(String uuid, Boolean isDelete);

    Response<FywSectorSubSector> getDataByFiscalYearWise(Long fiscalYearId, Boolean isDelete);

    BooleanValueHolderDTO doCheckValidity();

    FywSectorSubSectorResponse getFiscalData();

    Response<FiscalResponseDto> getAllFiscalYearByFinalCopy();
}
