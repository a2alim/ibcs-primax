export const DIVISION = [
    {name: 'Barishal', value: 'Barishal', checked: false,  expanded: false},
    {
        name: 'Chittagong', value: 'Chittagong', checked: false,  expanded: false, zilla: [
            {name: 'Feni', division: 'Chittagong', value: 'Feni', checked: false,  expanded: false},
            {name: 'Rangamati', division: 'Chittagong', value: 'Rangamati', checked: false,  expanded: false},
            {name: 'Coxs Bazar', division: 'Chittagong', value: 'Coxs Bazar', checked: false,  expanded: false},
            {name: 'Chandpur', division: 'Chittagong', value: 'Chandpur', checked: false,  expanded: false},
        ]
    },
    {
        name: 'Dhaka', value: 'Dhaka', checked: false,  expanded: false, zilla: [
            {name: 'Gazipur', division: 'Dhaka', value: 'Gazipur', checked: false,  expanded: false},
            {name: 'Kishoreganj', division: 'Dhaka', value: 'Kishoreganj', checked: false,  expanded: false},
            {name: 'Manikganj', division: 'Dhaka', value: 'Manikganj', checked: false,  expanded: false},
        ]
    },
    {name: 'Khulna', value: 'Khulna', checked: false,  expanded: false},
    {name: 'Mymensingh', value: 'Mymensingh', checked: false,  expanded: false},
    {name: 'Rajshahi', value: 'Rajshahi', checked: false,  expanded: false},
    {name: 'Sylhet', value: 'Sylhet', checked: false,  expanded: false, zilla: [
            {name: 'Habiganj', division: 'Sylhet', value: 'Habiganj', checked: false,  expanded: false},
            {name: 'Moulvibazar', division: 'Sylhet', value: 'Moulvibazar', checked: false,  expanded: false},
        ]
    }
];

export const ZILLA = [
    {name: 'Feni', division: 'Chittagong', value: 'Feni', checked: false,  expanded: false, upazila: [
            {name: 'Daganbhuiyan', division: 'Chittagong', zilla: 'Feni', value: 'Daganbhuiyan', checked: false,  expanded: false, },
            {name: 'Sonagazi', division: 'Chittagong', zilla: 'Feni', value: 'Sonagazi', checked: false,  expanded: false},
            {name: 'Fulgazi', division: 'Chittagong', zilla: 'Feni', value: 'Fulgazi', checked: false,  expanded: false},
        ]
    },
    {name: 'Rangamati', division: 'Chittagong', value: 'Rangamati', checked: false,  expanded: false},
    {name: 'Coxs Bazar', division: 'Chittagong', value: 'Coxs Bazar', checked: false,  expanded: false},
    {name: 'Chandpur', division: 'Chittagong', value: 'Chandpur', checked: false,  expanded: false},
    {name: 'Gazipur', division: 'Dhaka', value: 'Gazipur', checked: false,  expanded: false},
    {name: 'Kishoreganj', division: 'Dhaka', value: 'Kishoreganj', checked: false,  expanded: false, upazila: [
            {name: 'Austagram', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Austagram', checked: false,  expanded: false},
            {name: 'Nikli', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Nikli', checked: false,  expanded: false},
            {name: 'Bhairab', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Bhairab', checked: false,  expanded: false},
        ]
    },
    {name: 'Manikganj', division: 'Dhaka', value: 'Manikganj', checked: false,  expanded: false},
    {name: 'Habiganj', division: 'Sylhet', value: 'Habiganj', checked: false,  expanded: false},
    {name: 'Moulvibazar', division: 'Sylhet', value: 'Moulvibazar', checked: false,  expanded: false, upazila: [
            {name: 'Kamalganj', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kamalganj', checked: false,  expanded: false},
            {name: 'Kulaura', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kulaura', checked: false,  expanded: false},
            {name: 'Sreemangal', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Sreemangal', checked: false,  expanded: false},
            {name: 'Rajnagar', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Rajnagar', checked: false,  expanded: false},
        ]
    },
];

export const UPAZILA = [
    {
        name: 'Daganbhuiyan',
        division: 'Chittagong',
        zilla: 'Feni',
        value: 'Daganbhuiyan',
        checked: false,  expanded: false,
        municipality: [
            {
                name: 'Daganbhuiyan',
                division: 'Chittagong',
                zilla: 'Feni',
                upazila: 'Daganbhuiyan',
                value: 'Daganbhuiyan',
                checked: false,  expanded: false
            }
        ]
    },
    {
        name: 'Sonagazi', division: 'Chittagong', zilla: 'Feni', value: 'Sonagazi', checked: false,  expanded: false,
        municipality: [
            {
                name: 'Sonagazi',
                division: 'Chittagong',
                zilla: 'Feni',
                upazila: 'Sonagazi',
                value: 'Sonagazi',
                checked: false,  expanded: false
            },
        ]
    },
    {name: 'Fulgazi', division: 'Chittagong', zilla: 'Feni', value: 'Fulgazi', checked: false,  expanded: false},
    {
        name: 'Austagram', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Austagram', checked: false,  expanded: false, municipality: [
            {
                name: 'Austagram',
                division: 'Dhaka',
                zilla: 'Kishoreganj',
                upazila: 'Austagram',
                value: 'Austagram',
                checked: false,  expanded: false
            },
        ]
    },
    {name: 'Nikli', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Nikli', checked: false,  expanded: false},
    {name: 'Bhairab', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Bhairab', checked: false,  expanded: false},
    {name: 'Kamalganj', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kamalganj', checked: false,  expanded: false},
    {name: 'Kulaura', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kulaura', checked: false,  expanded: false},
    {
        name: 'Sreemangal', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Sreemangal', checked: false,  expanded: false,
        municipality: [
            {
                name: 'Sreemangal',
                division: 'Sylhet',
                zilla: 'Moulvibazar',
                upazila: 'Sreemangal',
                value: 'Sreemangal',
                checked: false,  expanded: false
            },
        ]
    },
    {name: 'Rajnagar', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Rajnagar', checked: false,  expanded: false},
];

export const MUNICIPALTY = [
    {
        name: 'Daganbhuiyan',
        division: 'Chittagong',
        zilla: 'Feni',
        upazila: 'Daganbhuiyan',
        value: 'Daganbhuiyan',
        checked: false,  expanded: false
    },
    {name: 'Sonagazi', division: 'Chittagong', zilla: 'Feni', upazila: 'Sonagazi', value: 'Sonagazi', checked: false,  expanded: false},
    {
        name: 'Austagram',
        division: 'Dhaka',
        zilla: 'Kishoreganj',
        upazila: 'Austagram',
        value: 'Austagram',
        checked: false,  expanded: false
    },
    {
        name: 'Sreemangal',
        division: 'Sylhet',
        zilla: 'Moulvibazar',
        upazila: 'Sreemangal',
        value: 'Sreemangal',
        checked: false,  expanded: false
    },
];

/*export const DATA = [
    {name: 'Barishal', value: 'Barishal', checked: false,  expanded: false},
    {
        name: 'Chittagong',
        value: 'Chittagong',
        checked: false,  expanded: false,
        zilla: [
            {
                name: 'Feni',
                division: 'Chittagong',
                value: 'Feni',
                checked: false,  expanded: false,
                upazila: [
                    {
                        name: 'Daganbhuiyan',
                        division: 'Chittagong',
                        zilla: 'Feni',
                        value: 'Daganbhuiyan',
                        checked: false,  expanded: false,
                        municipality: [
                            {
                                name: 'Daganbhuiyan',
                                division: 'Chittagong',
                                zilla: 'Feni',
                                upazila: 'Daganbhuiyan',
                                value: 'Daganbhuiyan',
                                checked: false,  expanded: false
                            },
                        ]
                    },
                    {
                        name: 'Sonagazi',
                        division: 'Chittagong',
                        zilla: 'Feni',
                        value: 'Sonagazi',
                        checked: false,  expanded: false,
                        municipality: [
                            {
                                name: 'Sonagazi',
                                division: 'Chittagong',
                                zilla: 'Feni',
                                upazila: 'Sonagazi',
                                value: 'Sonagazi',
                                checked: false,  expanded: false
                            },
                        ]
                    },
                    {name: 'Fulgazi', division: 'Chittagong', zilla: 'Feni', value: 'Fulgazi', checked: false,  expanded: false},
                ]
            },
            {name: 'Rangamati', division: 'Chittagong', value: 'Rangamati', checked: false,  expanded: false},
            {name: 'Coxs Bazar', division: 'Chittagong', value: 'Coxs Bazar', checked: false,  expanded: false},
            {name: 'Chandpur', division: 'Chittagong', value: 'Chandpur', checked: false,  expanded: false},
        ]
    },
    {
        name: 'Dhaka',
        value: 'Dhaka',
        checked: false,  expanded: false,
        zilla: [
            {name: 'Gazipur', division: 'Dhaka', value: 'Gazipur', checked: false,  expanded: false},
            {
                name: 'Kishoreganj',
                division: 'Dhaka',
                value: 'Kishoreganj',
                checked: false,  expanded: false,
                upazila: [
                    {
                        name: 'Austagram',
                        division: 'Dhaka',
                        zilla: 'Kishoreganj',
                        value: 'Austagram',
                        checked: false,  expanded: false,
                        municipality: [
                            {
                                name: 'Austagram',
                                division: 'Dhaka',
                                zilla: 'Kishoreganj',
                                upazila: 'Austagram',
                                value: 'Austagram',
                                checked: false,  expanded: false
                            },
                        ]
                    },
                    {name: 'Nikli', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Nikli', checked: false,  expanded: false},
                    {name: 'Bhairab', division: 'Dhaka', zilla: 'Kishoreganj', value: 'Bhairab', checked: false,  expanded: false},
                ]
            },
            {name: 'Manikganj', division: 'Dhaka', value: 'Manikganj', checked: false,  expanded: false},
        ]
    },
    {name: 'Khulna', value: 'Khulna', checked: false,  expanded: false},
    {name: 'Mymensingh', value: 'Mymensingh', checked: false,  expanded: false},
    {name: 'Rajshahi', value: 'Rajshahi', checked: false,  expanded: false},
    {
        name: 'Sylhet',
        value: 'Sylhet',
        checked: false,  expanded: false,
        zilla: [
            {name: 'Habiganj', division: 'Sylhet', value: 'Habiganj', checked: false,  expanded: false},
            {
                name: 'Moulvibazar',
                division: 'Sylhet',
                value: 'Moulvibazar',
                checked: false,  expanded: false,
                upazila: [
                    {name: 'Kamalganj', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kamalganj', checked: false,  expanded: false},
                    {name: 'Kulaura', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Kulaura', checked: false,  expanded: false},
                    {
                        name: 'Sreemangal',
                        division: 'Sylhet',
                        zilla: 'Moulvibazar',
                        value: 'Sreemangal',
                        checked: false,  expanded: false,
                        municipality: [
                            {
                                name: 'Sreemangal',
                                division: 'Sylhet',
                                zilla: 'Moulvibazar',
                                upazila: 'Sreemangal',
                                value: 'Sreemangal',
                                checked: false,  expanded: false
                            },
                        ]
                    },
                    {name: 'Rajnagar', division: 'Sylhet', zilla: 'Moulvibazar', value: 'Rajnagar', checked: false,  expanded: false},
                ]
            },
        ]
    }
];*/
