export const locale = {
    lang: 'bn',
    data: {
        'NAV': [
            /* {
                id: 'dashboards',
                title: 'ব্যবস্থাপনা',
                type: 'group',
                icon: 'heroicons_outline:home',
                children: [
                    {
                        id: 'navigation-features.level.0',
                        title: 'প্রকল্প ধারণা ম্যানেজমেন্ট',
                        icon: 'heroicons_outline:check-circle',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'প্রকল্প ধারণা সমূহ',
                                type: 'basic',
                                link: '/project-concept'
                            }
                        ]
                    },
                    {
                        id: 'navigation-features.level.0',
                        title: 'সম্ভাব্যতা অধ্যয়ন',
                        icon: 'heroicons_outline:check-circle',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'সম্ভাব্যতা তালিকা',
                                type: 'basic',
                                link: '/feasibility-study'
                            }
                        ]
                    },
                    {
                        id: 'navigation-features.level.0',
                        title: 'ডিপিপি / টিএপিপি ব্যবস্থাপনা',
                        icon: 'heroicons_outline:check-circle',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'ডিপিপি / টিএপিপি তালিকা',
                                type: 'basic',
                                link: '/dpp-tapp'
                            }
                        ]
                    },
                    {
                        id: 'navigation-features.level.0',
                        title: 'প্রশ্ন ব্যবস্থাপনা',
                        icon: 'heroicons_outline:check-circle',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'প্রশ্ন',
                                type: 'basic',
                                link: '/query/list'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'প্রশ্ন ও উত্তর ব্যাংক',
                                type: 'basic',
                                link: '/question-answer-bank/list'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'উত্তর প্রস্তুতি প্যানেল',
                                type: 'basic',
                                link: '/answer-preparation-panel/list'
                            }
                        ]
                    },
                    // {
                    //     id: 'navigation-features.level.0',
                    //     title: 'রিপোর্ট ম্যানেজমেন্ট',
                    //     icon: 'heroicons_outline:check-circle',
                    //     type: 'collapsable',
                    //     children: [
                    //         {
                    //             id: 'navigation-features.level.0.1',
                    //             title: 'পরিক্ষার িপোর্ট',
                    //             type: 'basic',
                    //             link: '/report-management/test-report'
                    //         }
                    //     ]
                    // },
                    {
                        id: 'navigation-features.level.0',
                        title: 'সেটিংস',
                        icon: 'heroicons_outline:check-circle',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Paripatra Version',
                                type: 'basic',
                                link: '/paripatra-version'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Department',
                                type: 'basic',
                                link: '/department'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'User Group',
                                type: 'basic',
                                link: '/user-group'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Justification Type',
                                type: 'basic',
                                link: '/justification-type'
                            },
                            // {
                            //     id: 'navigation-features.level.0.1',
                            //     title: 'Project Type',
                            //     type: 'basic',
                            //     link: '/project-type'
                            // },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Scope Task Type',
                                type: 'basic',
                                link: '/scope-task-type'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Procurement Method',
                                type: 'basic',
                                link: '/procurement-method'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Procurement Type',
                                type: 'basic',
                                link: '/procurement-type'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Priority',
                                type: 'basic',
                                link: '/priority'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Municipality',
                                type: 'basic',
                                link: '/municipality'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Currency',
                                type: 'basic',
                                link: '/currency'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Division',
                                type: 'basic',
                                link: '/division'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Zilla',
                                type: 'basic',
                                link: '/zilla'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Upazila',
                                type: 'basic',
                                link: '/upazila'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Unit',
                                type: 'basic',
                                link: '/unit'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Ministry Division',
                                type: 'basic',
                                link: '/ministry-division'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Sector Division',
                                type: 'basic',
                                link: '/sector-division'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Sector',
                                type: 'basic',
                                link: '/sector'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Sub Sector',
                                type: 'basic',
                                link: '/sub-sector'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Project Movement',
                                type: 'basic',
                                link: '/project-movement'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Agency',
                                type: 'basic',
                                link: '/agency'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Mode of finance',
                                type: 'basic',
                                link: '/mode-of-finance'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'PA Source',
                                type: 'basic',
                                link: '/paSource'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Main Cofog',
                                type: 'basic',
                                link: '/main-cofog'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Optional Cofog',
                                type: 'basic',
                                link: '/optional-cofog'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Details Cofog',
                                type: 'basic',
                                link: '/details-cofog'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Economic Code',
                                type: 'basic',
                                link: '/economicCode'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Economic Sub-Code',
                                type: 'basic',
                                link: '/subEconomicCode'
                            },
                            {
                                id: 'navigation-features.level.0.1',
                                title: 'Approval Value Setup',
                                type: 'basic',
                                link: '/approvalValueSetup'
                            }
                        ]
                    }
                ]
            } */
        ],
        'ACTION':null
    }
};
