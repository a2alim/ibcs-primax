package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.LinkageAndTargetDTO;

import java.util.List;

public interface LinkageAndTargetService {
    LinkageAndTargetDTO createLinkageTarget(LinkageAndTargetDTO linkageAndTargetDTO, Long projectSummaryId);

    LinkageAndTargetDTO getLinkageAndTargetListByProject(Long id);

    LinkageAndTargetDTO updateLinkageAndTarget(LinkageAndTargetDTO linkageAndTargetDTO, Long projectSummaryId);

    String deleteLinkageAndTarget(String uuid);
}
