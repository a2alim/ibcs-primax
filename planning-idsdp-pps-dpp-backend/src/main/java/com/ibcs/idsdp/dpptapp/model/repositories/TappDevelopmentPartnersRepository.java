package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppDevelopmentPartners;
import com.ibcs.idsdp.dpptapp.model.domain.TappDevelopmentPartners;
import com.ibcs.idsdp.dpptapp.model.domain.TappModeOfFinancing;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TappDevelopmentPartnersRepository extends ServiceRepository<TappDevelopmentPartners> {
    Optional<TappDevelopmentPartners> findByUuid(String Uuid);

    Optional<TappDevelopmentPartners> findByUuidAndTappObjectiveCostIdAndIsDeleted(String Uuid, Long tappMasterId, Boolean isDelete);

    List<TappDevelopmentPartners> findAllByTappObjectiveCostIdAndIsDeleted(Long tappMasterId, Boolean isDelete);

    @Modifying
    @Transactional
    @Query(value = "Delete from tapp_development_partners where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppDevPartners();


    @Modifying
    @Transactional
    @Query(value = "Delete from tapp_mode_of_financing where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppModeOfFinance();


    @Modifying
    @Transactional
    @Query(value = "Delete from tapp_currency_rates where dpp_master_id is NULL", nativeQuery = true)
    void deleteDppCurrencyRates();


}
