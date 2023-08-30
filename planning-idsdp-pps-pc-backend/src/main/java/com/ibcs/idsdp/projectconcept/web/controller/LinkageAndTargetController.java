package com.ibcs.idsdp.projectconcept.web.controller;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.LinkageAndTargetConstant;
import com.ibcs.idsdp.projectconcept.model.domain.LinkageAndTarget;
import com.ibcs.idsdp.projectconcept.services.LinkageAndTargetService;
import com.ibcs.idsdp.projectconcept.web.dto.LinkageAndTargetDTO;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(LinkageAndTargetConstant.PC_LINKAGE_TARGET)
public class LinkageAndTargetController extends BaseController<LinkageAndTarget, LinkageAndTargetDTO> {

    private final LinkageAndTargetService linkageAndTargetService;

    public LinkageAndTargetController(BaseService<LinkageAndTarget, LinkageAndTargetDTO> service, LinkageAndTargetService linkageAndTargetService) {
        super(service);
        this.linkageAndTargetService = linkageAndTargetService;
    }

    /**
     * For create linkage and target
     * @param linkageAndTargetDTO
     * @param projectSummaryId
     * @return linkageAndTargetDTO
     */
    @PostMapping(path = "/create/{projectSummaryId}", produces = "application/json")
    public LinkageAndTargetDTO create(@RequestBody LinkageAndTargetDTO linkageAndTargetDTO,  @PathVariable Long projectSummaryId) {
        return linkageAndTargetService.createLinkageTarget(linkageAndTargetDTO, projectSummaryId);
    }

    /**
     * For get linkage and target
     * @param id
     */
    @GetMapping("/getLinkageAndTargetListByProject/{id}")
    public LinkageAndTargetDTO getLinkageAndTargetListByProject(@PathVariable Long id) {
        return linkageAndTargetService.getLinkageAndTargetListByProject(id);
    }

    /**
     * For update linkage and target
     * @param linkageAndTargetDTO
     * @param projectSummaryId
     * @return linkageAndTargetDTO
     */
    @PutMapping("/update/{projectSummaryId}")
    public LinkageAndTargetDTO update(@RequestBody LinkageAndTargetDTO linkageAndTargetDTO, @PathVariable Long projectSummaryId) {
        return linkageAndTargetService.updateLinkageAndTarget(linkageAndTargetDTO, projectSummaryId);
    }

    /**
     * For delete linkage and target
     * @param uuid
     */
    @DeleteMapping("/delete/{uuid}")
    public String deleteLinkageAndTarget(@PathVariable String uuid) {
        return linkageAndTargetService.deleteLinkageAndTarget(uuid);
    }



}
