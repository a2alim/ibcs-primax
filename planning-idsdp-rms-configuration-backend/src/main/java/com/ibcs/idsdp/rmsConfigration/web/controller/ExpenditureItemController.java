package com.ibcs.idsdp.rmsConfigration.web.controller;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ExpenditureItemConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpenditureItem;
import com.ibcs.idsdp.rmsConfigration.services.ExpenditureItemService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpenditureItemRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(ExpenditureItemConstant.EXPENDITURE_ITEM)
public class ExpenditureItemController extends BaseController<ExpenditureItem, ExpenditureItemRequestDto, ExpenditureItemResponseDto> {


    final private ExpenditureItemService expenditureService;

    public ExpenditureItemController(BaseService<ExpenditureItem, ExpenditureItemRequestDto, ExpenditureItemResponseDto> service, ExpenditureItemService expenditureService) {
        super(service);
        this.expenditureService = expenditureService;
    }


    @PostMapping(path = ExpenditureItemConstant.EXPENDITURE_ITEM_UNIQUE, produces = "application/json")
    public Response<ExpenditureItemResponseDto> createExpenditureItems(@RequestBody ExpenditureItemRequestDto expenditureItemRequestDto){
        return expenditureService.createExpenditureItem(expenditureItemRequestDto);
    }

    @PutMapping(path = ExpenditureItemConstant.UPDATE_EXPENDITURE_ITEM_UNIQUE, produces = "application/json")
    public Response<ExpenditureItemResponseDto> updateFiscalYear(@RequestBody ExpenditureItemRequestDto expenditureItemRequestDto){
        return expenditureService.updateExpenditureItem(expenditureItemRequestDto);
    }

    @GetMapping(path = ExpenditureItemConstant.EXPENDITURE_ITEM_ACTIVE, produces = "application/json")
    public Response<ExpenditureItem> getExpenditureActive(){
        return expenditureService.getActiveExpenditureItem();
    }
    
    @GetMapping(path = ExpenditureItemConstant.FIND_BY_EXPENDITURE_ITEMS_NAME, produces = "application/json")
    public Response<ExpenditureItemResponseDto> findByExpenditureName(@PathVariable("itemsName") String itemsName){
        return expenditureService.findByExpenditureName(itemsName);
    }

    @GetMapping(path = ExpenditureItemConstant.GET_ACTIVE_LIST, produces = "application/json")
    public Response<ExpenditureItemResponseDto> findByAdminIdOrCreatedById(){
        return expenditureService.findByAdminIdOrCreatedById();
    }
    
    
}
