package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Urls;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UrlsRepository extends JpaRepository<Urls, Long> {
}
