package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.CostOfMajorItem;
import com.ibcs.idsdp.dpptapp.model.domain.ItemWiseCostEstimated;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostOfMajorItemRepository extends JpaRepository<CostOfMajorItem, Long> {


}
