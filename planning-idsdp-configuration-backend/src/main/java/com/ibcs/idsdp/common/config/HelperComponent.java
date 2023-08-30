package com.ibcs.idsdp.common.config;


import org.springframework.stereotype.Component;

@Component
public class HelperComponent {

	// Null And Empty checking of String value
	public boolean nonNullAndNotEmptyStringCheck(String str) {
		boolean response = false;
		if (str != null && !str.trim().isEmpty()) {
			response = true;
		}
		return response;
	}

	// Null and Greater than 0 checking of Double value
	public boolean nonNullAndNonZeroDoubleCheck(Double value) {
		boolean response = false;
		if (value != null && value.compareTo(0.0) > 0) {
			response = true;
		}
		return response;
	}


}
