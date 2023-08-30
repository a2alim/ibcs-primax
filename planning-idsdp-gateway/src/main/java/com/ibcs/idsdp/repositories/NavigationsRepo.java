package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.Navigations;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationsRepo extends JpaRepository<Navigations, Long> {

    Navigations findByTitle(String title);
    Navigations findByParent(Navigations navigations);
    List<Navigations> findAllByParent(Navigations navigations);
    Navigations findByLink(String link);

}
