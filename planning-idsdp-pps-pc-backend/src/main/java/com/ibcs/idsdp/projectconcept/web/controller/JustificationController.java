package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.JustificationConstant;
import com.ibcs.idsdp.projectconcept.model.domain.Justification;
import com.ibcs.idsdp.projectconcept.services.JustificationService;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationDTO;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationListDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestApiController
@RequestMapping(JustificationConstant.JUSTIFICATION)
public class JustificationController extends BaseController<Justification, JustificationDTO> {

    private final JustificationService justificationService;

    public JustificationController(BaseService<Justification, JustificationDTO> service, JustificationService justificationService) {
        super(service);
        this.justificationService = justificationService;
    }

    /*
     * Create for Justification
     * @param justificationDto
     * @param projectSummaryId
     * @return JustificationDTO
     */

    @PostMapping(path = JustificationConstant.CREATE, produces = "application/json")
    public ResponseEntity<ResponseStatus> create(@RequestBody JustificationDTO justificationDto, @PathVariable Long projectSummaryId) {
        return justificationService.createJustification(justificationDto, projectSummaryId);
    }

    /*
     * Get List for Justification
     * @param id
     * @return List<JustificationListDto>
     */

    @GetMapping(path = JustificationConstant.GET_JUSTIFICATION_LIST, produces = "application/json")
    public List<JustificationListDto> getJustificationListByProject(@PathVariable Long id) {
        return justificationService.getJustificationListByProject(id);
    }

    /*
     * Update for Justification
     * @param justificationDTO
     * @param projectSummaryId
     * @return JustificationDTO
     */

    @PutMapping(path = JustificationConstant.UPDATE, produces = "application/json")
    public ResponseEntity<ResponseStatus> update( @RequestBody JustificationDTO justificationDTO, @PathVariable Long projectSummaryId) {
        return justificationService.updateJustification(justificationDTO, projectSummaryId);
    }
}
