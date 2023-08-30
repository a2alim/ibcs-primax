package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSector;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorService;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorRequestDTO;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping("api/fyw-sector-sub-sector/")
public class FywSectorSubSectorController extends BaseController<FywSectorSubSector, FywSectorSubSectorRequestDTO, FywSectorSubSectorResponse> {

    public final FywSectorSubSectorService fywSectorSubSectorService;

    public FywSectorSubSectorController(BaseService<FywSectorSubSector, FywSectorSubSectorRequestDTO, FywSectorSubSectorResponse> service, FywSectorSubSectorService fywSectorSubSectorService) {
        super(service);
        this.fywSectorSubSectorService = fywSectorSubSectorService;
    }

    @PostMapping(path = "add", produces = "application/json")
    public Response<FywSectorSubSectorResponse> dataSave(@RequestBody FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO) {
        System.out.println(fywSectorSubSectorRequestDTO);
        return fywSectorSubSectorService.dataSave(fywSectorSubSectorRequestDTO);
    }

//    @PostMapping(path = "add", produces = "application/json")
//    public Response<FywSectorSubSectorSectionResponse> dataSave(@RequestBody FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest) {
//        System.out.println(fywSectorSubSectorSectionRequest);
//        return fywSectorSubSectorSectionService.dataSave(fywSectorSubSectorSectionRequest);
//    }

    @PutMapping(path = "edit", produces = "application/json")
    public Response<FywSectorSubSectorResponse> dataUpdate(@RequestBody FywSectorSubSectorRequestDTO fywSectorSubSectorRequestDTO) {
        return fywSectorSubSectorService.dataUpdate(fywSectorSubSectorRequestDTO);
    }

    @GetMapping(path = "check/validity", produces = "application/json")
    public ResponseEntity<BooleanValueHolderDTO> checkValidity() {
        BooleanValueHolderDTO resDto =fywSectorSubSectorService.doCheckValidity();
        return new ResponseEntity<BooleanValueHolderDTO>(resDto, HttpStatus.OK);
    }


    @GetMapping(path = "get/available/fiscal-year", produces = "application/json")
    public ResponseEntity<FywSectorSubSectorResponse> getAvailableFiscalYear() {
        FywSectorSubSectorResponse resDto =fywSectorSubSectorService.getFiscalData();
        return new ResponseEntity<FywSectorSubSectorResponse>(resDto, HttpStatus.OK);
    }


    @GetMapping(path = "get-seciality/{typeNo}", produces = "application/json")
    public ResponseEntity<List<FywSectorSubSector>> findAllByActiveData(@PathVariable("typeNo") Integer typeNo) {
        return fywSectorSubSectorService.findAllByActiveData(typeNo);
    }

    @GetMapping(path = "get-data-by-uuid/{uuid}", produces = "application/json")
    public ResponseEntity<FywSectorSubSectorResponse> getDataByUuid(@PathVariable("uuId") String uuId){
        return fywSectorSubSectorService.getDataByUuid(uuId,false);
    }

    @GetMapping(path = "get-request-letters/{fiscalYearId}", produces = "application/json")
    public Response<FywSectorSubSector> getDataByFiscalYearWise(@PathVariable Long fiscalYearId){
        return fywSectorSubSectorService.getDataByFiscalYearWise(fiscalYearId, false);
    }

    @GetMapping(path = "final-copy/fiscal-year/all", produces = "application/json")
    public Response<FiscalResponseDto> getAllFiscalYearByFinalCopy(){
        return fywSectorSubSectorService.getAllFiscalYearByFinalCopy();
    }
}
