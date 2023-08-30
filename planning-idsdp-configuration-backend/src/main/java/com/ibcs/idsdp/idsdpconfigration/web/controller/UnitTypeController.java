package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UnitType;
import com.ibcs.idsdp.idsdpconfigration.services.UnitTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UnitTypeRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping("/unit-type")
public class UnitTypeController extends BaseController<UnitType, UnitTypeRequest> {

    public final UnitTypeService unitTypeService;

    /**
     * Constructor
     * @param baseService
     * @param unitTypeService
     */
    public UnitTypeController(BaseService<UnitType, UnitTypeRequest> baseService, UnitTypeService unitTypeService) {
        super(baseService);
        this.unitTypeService = unitTypeService;
    }

    /**
     * For create unit type records
     * @param unitTypeRequest~
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public UnitTypeRequest create(@RequestBody UnitTypeRequest unitTypeRequest) {
        unitTypeRequest.setCode(unitTypeService.generateCodeNumber(unitTypeRequest.getUnitTypeNameEng()));
        return super.create(unitTypeRequest);
    }


}
