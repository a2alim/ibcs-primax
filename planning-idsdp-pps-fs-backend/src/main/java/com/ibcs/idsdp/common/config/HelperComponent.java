package com.ibcs.idsdp.common.config;


import lombok.Synchronized;
import org.springframework.stereotype.Component;

@Component
public class HelperComponent {

	public boolean nonNullAndNotEmptyStringCheck(String str) {
		boolean response = false;
		if (str != null && !str.trim().isEmpty()) {
			response = true;
		}
		return response;
	}

	public boolean nonNullAndNonZeroDoubleCheck(Double value) {
		boolean response = false;
		if (value != null && value.compareTo(0.0) > 0) {
			response = true;
		}
		return response;
	}


}
