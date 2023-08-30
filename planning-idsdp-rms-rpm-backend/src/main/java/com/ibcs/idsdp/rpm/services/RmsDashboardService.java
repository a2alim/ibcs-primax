package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.util.Response;

import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 1/6/22
 * @github `https://github.com/moniruzzamanrony`
 */
public interface RmsDashboardService {
    Response getRmsDashboardData(Optional<Long> fiscalYearId);
}
