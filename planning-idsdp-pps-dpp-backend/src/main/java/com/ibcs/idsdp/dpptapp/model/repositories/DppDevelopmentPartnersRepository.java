package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppDevelopmentPartners;
import feign.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Optional;

public interface DppDevelopmentPartnersRepository extends ServiceRepository<DppDevelopmentPartners> {
    Optional<DppDevelopmentPartners> findByUuid(String Uuid);

    @Modifying
    @Transactional
    @Query(value = "Delete from dpp_development_partners where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppDevPartners();


    @Modifying
    @Transactional
    @Query(value = "Delete from dpp_mode_of_financing where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppModeOfFinance();


    @Modifying
    @Transactional
    @Query(value = "Delete from dpp_currency_rates where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppCurrencyRates();


}
