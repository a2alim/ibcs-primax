package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Navigations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationsRepository extends JpaRepository<Navigations, Long> {

    Navigations findByTitle(String title);
    Navigations findByParent(Navigations navigations);
    List<Navigations> findAllByParentOrderByOrdersAsc(Navigations navigations);
    List<Navigations> findAllByType(String type);

}
