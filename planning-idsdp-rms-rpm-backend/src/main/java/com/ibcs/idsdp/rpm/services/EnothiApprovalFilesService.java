package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.eNothi.PagableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.SendToEnothiRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EnothiApprovalFilesResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.eNothi.EnothiResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface EnothiApprovalFilesService {
    Response<EnothiApprovalFilesResponseDto> dataSave(Optional<MultipartFile[]> files, String body);
    Response<EnothiApprovalFilesResponseDto> dataUpdate(Optional<MultipartFile[]> files, String body);
    Response<EnothiApprovalFilesResponseDto> sendToEnothi(SendToEnothiRequestDto sendToEnothiRequestDto);
    Response<EnothiApprovalFilesResponseDto> getNothiApprovalList(PagableRequestDto requestDto);

    Response<EnothiResearcherProposalResponseDto> getResearcherProposalObjectByUuid(String proposalId);
}
