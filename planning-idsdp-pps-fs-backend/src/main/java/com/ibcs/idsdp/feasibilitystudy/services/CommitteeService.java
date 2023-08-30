package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.CommitteeDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.CommitteeRequest;
import org.springframework.data.domain.Page;

public interface CommitteeService {
    CommitteeDTO createCommittee(CommitteeDTO committeeDTO);

    Page<CommitteeDTO> getCommitteeListByFspMasterId(CommitteeRequest request);

    CommitteeDTO updateCommitteeWithMember(CommitteeDTO committeeDTO);
}
