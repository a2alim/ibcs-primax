package com.ibcs.idsdp.rpm.jasperConfig;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by : rakibul.hasan on 12/13/2021 11:58 AM
 * github : https://github.com/rhmtechno
 */
@Component
public  class JasperCommonUtils {

    public ResponseEntity<byte[]> respondReportOutputWithoutHeader(CusJasperReportDef jasperReport,
                                                                   boolean forceDownload) throws IOException {
        if (jasperReport == null || jasperReport.getContent() == null) {
            throw new FileNotFoundException("jasper Report Not found");
        } else {
            String outputFileName = (jasperReport.getOutputFilename()) + "."
                    + jasperReport.getReportFormat().getExtension();
            String contentDisposition = forceDownload == true ? "attachment;filename=\"" + outputFileName + "\""
                    : "filename=\"" + outputFileName + "\"";
            return ResponseEntity.ok()
                    .header("Content-Type", jasperReport.getReportFormat().getMimeType() + ";charset=UTF-8")
                    .header("Content-Disposition", contentDisposition).body(jasperReport.getContent());

        }
    }

    public static String getResoucePath(String filePath) {
        Path resource = Paths.get(filePath);
        return resource.toAbsolutePath().toString() + File.separator;
    }
}
