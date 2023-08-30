package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationRepository extends JpaRepository<Navigation, Long> {

    List<Navigation> findBySubMenuNavId(String subMenuNav);

}
