package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.TemplateType;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;

@Repository
public interface TemplateTypeRepository extends ServiceRepository<TemplateType>{

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    List<TemplateType> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);
}
