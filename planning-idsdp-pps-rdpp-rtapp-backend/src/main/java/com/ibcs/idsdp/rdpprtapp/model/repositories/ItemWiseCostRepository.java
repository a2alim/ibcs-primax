package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.ItemWiseCostEstimated;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemWiseCostRepository extends JpaRepository<ItemWiseCostEstimated, Long> {


}
