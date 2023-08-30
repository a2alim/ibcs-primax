package com.ibcs.idsdp.rmsConfigration.web.controller;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.InstallmentTypeConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentType;
import com.ibcs.idsdp.rmsConfigration.services.InstallmentTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.InstallmentTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(InstallmentTypeConstant.INSTALLMENT_TYPE)
public class InstallmentTypeController extends BaseController<InstallmentType, InstallmentTypeRequestDto,InstallmentTypeResponseDto> {


final private InstallmentTypeService installmentTypeService;

    public InstallmentTypeController(BaseService<InstallmentType, InstallmentTypeRequestDto, InstallmentTypeResponseDto> service, InstallmentTypeService installmentTypeService) {
        super(service);
        this.installmentTypeService = installmentTypeService;
    }


    @PostMapping(path = InstallmentTypeConstant.INSTALLMENT_TYPE_UNIQUE, produces = "application/json")
    public Response<InstallmentTypeResponseDto> createFiscalYear(@RequestBody InstallmentTypeRequestDto installmentTypeRequestDto){
        return installmentTypeService.createInstallmentType(installmentTypeRequestDto);
    }
    @PutMapping(path = InstallmentTypeConstant.UPDATE_INSTALLMENT_TYPE_UNIQUE, produces = "application/json")
    public Response<InstallmentTypeResponseDto> updateFiscalYear(@RequestBody InstallmentTypeRequestDto installmentTypeRequestDto){
        return installmentTypeService.updateInstallmentType(installmentTypeRequestDto);
    }

    @GetMapping(path = InstallmentTypeConstant.ACTIVE_INSTALLMENT_TYPE, produces = "application/json")
    public Response<InstallmentType> findAllByActive() {
        return installmentTypeService.findAllByActive(false,true);
    }


    @GetMapping(path = InstallmentTypeConstant.INSTALLMENT_TYPE_BY_ID, produces = "application/json")
    public Response<InstallmentType> getInstallmentTypeById(@PathVariable("id") Long id) {
        return this.getById(id);
    }
}
