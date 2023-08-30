package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmount;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface CategoryWiseGrantAmountFilesRepository extends ServiceRepository<CategoryWiseGrantAmountFiles>{

@Transactional
@Modifying
@Query(value = "DELETE from CategoryWiseGrantAmountFiles st WHERE st.id=:id")
void forceDelete(@Param("id")Long id);
}
