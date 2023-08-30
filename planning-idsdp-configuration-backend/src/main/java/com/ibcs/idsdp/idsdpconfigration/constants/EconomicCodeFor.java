package com.ibcs.idsdp.idsdpconfigration.constants;

public enum EconomicCodeFor {

    REVENUE("Revenue", 1),
    CAPITAL("Capital", 2);

    private String name;
    private Integer value;

    EconomicCodeFor(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

}
