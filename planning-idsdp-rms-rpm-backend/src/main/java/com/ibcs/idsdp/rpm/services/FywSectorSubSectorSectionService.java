package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSectorSection;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorSectionRequest;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorSectionResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface FywSectorSubSectorSectionService {
    Response<FywSectorSubSectorSectionResponse> dataSave(FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest);
    Response<FywSectorSubSectorSectionResponse> dataUpdate(FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest);

    ResponseEntity<List<FywSectorSubSectorSection>> findAllByIsDeleted();

    Response<FywSectorSubSectorSection> getFywSectorSubSector(Long fiscalYearid, Boolean isDelete);
}
