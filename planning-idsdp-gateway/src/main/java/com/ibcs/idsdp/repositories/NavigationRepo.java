package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NavigationRepo extends JpaRepository<Navigation, Long> {

    Navigation findByNavId(String navId);

    Navigation findBySubMenuNavId(String subMenuId);

    Navigation findByMenuNavId(String menuNavId);
}
