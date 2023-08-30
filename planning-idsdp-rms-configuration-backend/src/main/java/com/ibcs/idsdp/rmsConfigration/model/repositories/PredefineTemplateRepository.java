package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.PredefineTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredefineTemplateRepository extends ServiceRepository<PredefineTemplate>{


    List<PredefineTemplate> findAllByTemplateTypeIdAndIsDeletedAndActive(Integer id, boolean b, boolean b1);

    List<PredefineTemplate> findByTemplateTypeIdAndIsDeleted(Integer templateTypeId, boolean b);
}
