package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpenditureItem;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenditureItemRepository extends ServiceRepository<ExpenditureItem>{

    Optional<ExpenditureItem> findByExpItemsNameAndExpItemsForAndIsDeleted(String exName, String exFor, Boolean isDeleted);

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    @Query(value = "SELECT * from st_expenditure_item  where is_deleted=false and exp_items_name=? and exp_items_for=? and id<>?",nativeQuery = true)
    Optional<ExpenditureItem> findByExpItemsNameAndExpItemsFor(String expItemsName, String expItemsFor, Long id);

    List<ExpenditureItem> findAllByActiveAndIsDeleted(boolean active, boolean idDeleted);
    
    Optional<ExpenditureItem> findByExpItemsNameAndIsDeleted(String exName, Boolean isDeleted);
    List<ExpenditureItem> findByAddByAdminOrCreatedByAndIsDeleted(boolean addByAdmin, String createdByUserId, boolean isDeleted);
}
