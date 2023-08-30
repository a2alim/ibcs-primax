package com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MeetingPaperResponse {
    private String stage;
    private boolean status;
}
