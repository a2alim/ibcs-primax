package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.EnothiApprovalFiles;
import com.ibcs.idsdp.rpm.services.EnothiApprovalFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.EnothiApprovalFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.PagableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.SendToEnothiRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EnothiApprovalFilesResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.eNothi.EnothiResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestApiController
@RequestMapping("api/eNothi-approval/")
public class EnothiApprovalFilesController extends BaseController<EnothiApprovalFiles, EnothiApprovalFilesRequestDto, EnothiApprovalFilesResponseDto> {

    public final EnothiApprovalFilesService enothiApprovalFilesService;
    public final UaaClientService uaaClientService;

    public EnothiApprovalFilesController(BaseService<EnothiApprovalFiles, EnothiApprovalFilesRequestDto, EnothiApprovalFilesResponseDto> service, EnothiApprovalFilesService enothiApprovalFilesService, UaaClientService uaaClientService) {
        super(service);
        this.enothiApprovalFilesService = enothiApprovalFilesService;
        this.uaaClientService = uaaClientService;
    }

    @PostMapping(path = "add", produces = "application/json")
    public Response<EnothiApprovalFilesResponseDto> dataSave(@RequestParam("file") Optional<MultipartFile[]> files, @RequestParam("body") String body) {
        return enothiApprovalFilesService.dataSave(files, body);
    }

    @PutMapping(value = "edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response dataUpdate(@RequestParam("file") Optional<MultipartFile[]> files, @RequestParam("body") String body) {
        return enothiApprovalFilesService.dataUpdate(files, body);
    }

    @PostMapping(path = "send-to-eNothi", produces = "application/json")
    public Response<EnothiApprovalFilesResponseDto> dataSave(@RequestBody SendToEnothiRequestDto sendToEnothiRequestDto) {
        return enothiApprovalFilesService.sendToEnothi(sendToEnothiRequestDto);
    }

    @GetMapping(path = "find-user-by-id/{userId}", produces = "application/json")
    public ResponseEntity<UserResponse> getUserList(@PathVariable("userId") Long userId) {
        return uaaClientService.getUser(userId);
    }

    @PostMapping(path = "get-data-list", produces = "application/json")
    public Response<EnothiApprovalFilesResponseDto> getNothiApprovalList(@RequestBody PagableRequestDto requestDto){
        return enothiApprovalFilesService.getNothiApprovalList(requestDto);
    }

    @GetMapping(path = "get-research-proposal-by-uuid/{proposalUuid}", produces = "application/json")
    public Response<EnothiResearcherProposalResponseDto> getResearcherProposal(@PathVariable("proposalUuid") String proposalUuid) {
        return enothiApprovalFilesService.getResearcherProposalObjectByUuid(proposalUuid);
    }

}
