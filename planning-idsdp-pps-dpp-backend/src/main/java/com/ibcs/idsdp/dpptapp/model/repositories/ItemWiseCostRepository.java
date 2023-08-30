package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.ItemWiseCostEstimated;
import com.ibcs.idsdp.dpptapp.model.domain.SimilarProjectStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemWiseCostRepository extends JpaRepository<ItemWiseCostEstimated, Long> {


}
