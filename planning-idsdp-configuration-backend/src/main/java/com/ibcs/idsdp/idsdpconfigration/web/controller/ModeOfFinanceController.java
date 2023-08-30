package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ModeOfFinanceConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ModeOfFinance;
import com.ibcs.idsdp.idsdpconfigration.services.ModeOfFinanceService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ModeFinanceMoveRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ModeOfFinanceConstant.MODE_OF_FINANCE)
public class ModeOfFinanceController extends BaseController<ModeOfFinance, ModeOfFinanceDTO> {

    private final ModeOfFinanceService modeOfFinanceService;

    public ModeOfFinanceController(BaseService<ModeOfFinance, ModeOfFinanceDTO> baseService, ModeOfFinanceService modeOfFinanceService) {
        super(baseService);
        this.modeOfFinanceService = modeOfFinanceService;
    }

    // For Getting All Active Mode Of Finance
    @GetMapping(path = ModeOfFinanceConstant.GET_ACTIVE_MODE_OF_FINANCE + "/{page}" + "/{size}", produces = "application/json")
    public Page<ModeOfFinanceDTO> getActiveModeOfFinance(@PathVariable("page") int page, @PathVariable("size") int size) {
        return modeOfFinanceService.getActiveModeOfFinance(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }


    // Get all active data with max parameter and Order by OrderId
    @GetMapping(path = ModeOfFinanceConstant.GET_ACTIVE_MODE_OF_FINANCE_BY_ORDER_ID + "/{page}" + "/{size}", produces = "application/json")
    public Page<ModeOfFinanceDTO> getModeFinanceByOrderId(@PathVariable("page") int page, @PathVariable("size") int size) {
        return modeOfFinanceService.getModeOfFinanceByOrderId(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    // Change priority order in OrderId
    @PostMapping(path = ModeOfFinanceConstant.MOVE_MODE_FINANCE, produces = "application/json")
    public void moveProject(@RequestBody ModeFinanceMoveRequest modeFinanceMoveRequest) {
        modeOfFinanceService.moveModeFinance(modeFinanceMoveRequest);
    }

    @GetMapping(path = ModeOfFinanceConstant.ONLY_ACTIVE_MODE_FIN)
    public ResponseEntity<List<ModeOfFinanceDTO>> getActiveModeFinData(){
        return modeOfFinanceService.getActiveModeFinData(true, false);
    }
}
