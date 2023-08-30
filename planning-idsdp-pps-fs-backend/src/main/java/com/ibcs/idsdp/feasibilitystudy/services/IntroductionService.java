package com.ibcs.idsdp.feasibilitystudy.services;


import com.ibcs.idsdp.feasibilitystudy.web.dto.IntroductionDTO;

public interface IntroductionService {

    IntroductionDTO getIntroductionByFsrMasterId(Long fsrMasterId);
}
