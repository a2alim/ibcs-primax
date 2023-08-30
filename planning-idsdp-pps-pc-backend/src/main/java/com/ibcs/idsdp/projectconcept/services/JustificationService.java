package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationDTO;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationListDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface JustificationService {
    ResponseEntity<ResponseStatus> createJustification(JustificationDTO justificationDTO, Long projectSummaryId);

    List<JustificationListDto> getJustificationListByProject(Long id);

    ResponseEntity<ResponseStatus> updateJustification(JustificationDTO justificationDTO, Long projectSummaryId);
}
