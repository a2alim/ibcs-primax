package com.ibcs.idsdp.rpm.services.jasperService;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 3/7/2022 11:45 AM
 * github : https://github.com/rhmtechno
 */
public interface ByteToPdfJasperService {

    void profileReport(String uuid, String lang) throws ExecutionException, InterruptedException, IOException;


}
