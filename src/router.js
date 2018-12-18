import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录-预购宝管理平台'
    },
    component: resolve => {
        require(['./views/login.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['./views/error_page/404.vue'], resolve);
    }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => {
        require(['./views/error_page/401.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => {
        require(['./views/error_page/500.vue'], resolve);
    }
};

// export const preview = {
//     path: '/preview',
//     name: 'preview',
//     component: resolve => {
//         require(['./views/form/article-publish/preview.vue'], resolve);
//     }
// };

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => {
        require(['./views/main_components/locking-page.vue'], resolve);
    }
};
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [{
        path: 'home',
        title: {
            i18n: 'home'
        },
        mixedRights: true,
        name: 'home_index',
        component: resolve => {
            require(['./views/home/home.vue'], resolve);
        }
    },
    {
        path: 'own-space',
        title: '个人信息修改',
        name: 'own_space',
        mixedRights: false,
        component: resolve => {
            require(['./views/own-space/own-space.vue'], resolve);
        }
    }
        // ,{
        //     path: 'user/list/:list_id',
        //     title: '订单详情',
        //     access: 0,
        //     name: 'order_info',
        //     component: resolve => {
        //         require(['./views/advanced-router/component/order-info.vue'], resolve);
        //     }
        // }
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/system',
        icon: 'android-settings',
        name: 'system',
        title: '系统管理',
        mixedRights: true,
        access: 0,
        component: Main,
        children: [
            // {
            //     path: 'area',
            //     icon: 'aperture',
            //     mixedRights: true,
            //     access: 0,
            //     name: 'system-area',
            //     title: '区域管理',
            //     component: resolve => {
            //         require(['./views/system/area.vue'], resolve);
            //     }
            // },
            {
                path: 'department',
                icon: 'aperture',
                mixedRights: true,
                access: 0,
                name: 'admin_department',
                title: '部门管理',
                component: resolve => {
                    require(['./views/system/department.vue'], resolve);
                }
            }, {
                path: 'assignments',
                icon: 'star',
                name: 'admin_assignments',
                mixedRights: true,
                access: 0,
                title: '后台管理账户',
                component: resolve => {
                    require(['./views/system/assignments.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/user',
        icon: 'person',
        name: 'user',
        mixedRights: true,
        title: '会员管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'compose',
                name: 'user_list',
                title: '会员信息',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/user/user.vue'], resolve);
                }
            }, {
                path: 'authentication',
                icon: 'clipboard',
                name: 'real_name_authentication',
                title: '会员实名认证',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/user/realNameAuthentication.vue'], resolve);
                }
            }, {
                path: 'settlement',
                icon: 'clipboard',
                name: 'user_settlement',
                title: '会员结算',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/user/settlement.vue'], resolve);
                }
            }, 
            // {
            //     path: 'reward',
            //     icon: 'clipboard',
            //     name: 'user_reward',
            //     title: '会员奖励统计',
            //     mixedRights: true,
            //     access: 0,
            //     component: resolve => {
            //         require(['./views/user/reward.vue'], resolve);
            //     }
            // },
//           {
//              path: 'orders',
//              icon: 'archive',
//              name: 'user_orders',
//              title: '会员订单',
//              mixedRights: true,
//              access: 0,
//              component: resolve => {
//                  require(['./views/user/orders.vue'], resolve);
//              }
//          }, 
            // {
            //     path: 'cash',
            //     icon: 'social-yen',
            //     name: 'user_cash',
            //     title: '会员提现',
            //     mixedRights: true,
            //     access: 0, // 0需要授权 1反之
            //     component: resolve => {
            //         require(['./views/user/cash.vue'], resolve);
            //     }
            // },
            // {
            //     path: 'linerecharge',
            //     icon: 'social-usd',
            //     name: 'linerecharge',
            //     title: '线下充值审核',
            //     mixedRights: true,
            //     access: 0, // 0需要授权 1反之
            //     component: resolve => {
            //         require(['./views/user/linerecharge.vue'], resolve);
            //     }
            // },
            // {
            //     path: 'integral',
            //     icon: 'social-usd',
            //     name: 'integral',
            //     title: '积分分发',
            //     mixedRights: true,
            //     access: 0, // 0需要授权 1反之
            //     component: resolve => {
            //         require(['./views/user/integral.vue'], resolve);
            //     }
            // },
            // {
            //     path: 'IntegralDistribution',
            //     icon: 'document-text',
            //     name: 'IntegralDistribution',
            //     title: '积分分发工具',
            //     mixedRights: true,
            //     access: 0,
            //     component: resolve => {
            //         require(['./views/user/IntegralDistribution.vue'], resolve);
            //     }
            // }
        ]
    },
    {
        path: '/merchant',
        icon: 'nuclear',
        name: 'merchant',
        title: '商户管理',
        mixedRights: true,
        access: 0,
        component: Main,
        children: [

            {
                path: 'list',
                icon: 'android-clipboard',
                name: 'merchant_list',
                title: '商户信息管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/merchant/merchant.vue'], resolve);
                }
            },
            {
                path: 'orders',
                icon: 'archive',
                name: 'merchant_orders',
                title: '商圈订单管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/merchant/orders.vue'], resolve);
                }
            }, {
                path: 'cash',
                icon: 'social-yen',
                name: 'merchant_cash',
                title: '商户提现管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/merchant/cash.vue'], resolve);
                }
            }, {
                path: 'integral',
                icon: 'clipboard',
                name: 'merchant_integral',
                title: '商户结算对账',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/merchant/integral.vue'], resolve);
                }
            },
            {
            
                path: 'account',
                icon: 'clipboard',
                name: 'account',
                title: '结算中心',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/merchant/account.vue'], resolve);
                }
            },
            {
            
                path: 'mreview',
                icon: 'clipboard',
                name: 'mreview',
                title: '商户申请审核',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/merchant/mreview.vue'], resolve);
                }
            },            
            // {
            //     path: 'jfintegral',
            //     icon: 'social-usd',
            //     name: 'merchant_jfintegral',
            //     title: '积分分发',
            //     mixedRights: true,
            //     access: 0, // 0需要授权 1反之
            //     component: resolve => {
            //         require(['./views/merchant/jfintegral.vue'], resolve);
            //     }
            // }

        ]
    },
    {
        path: '/agents',
        icon: 'trophy',
        name: 'agents',
        title: '代理商管理',
        mixedRights: true,
        access: 0,
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'compose',
                name: 'agents_list',
                title: '代理商信息管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/agents/agents.vue'], resolve);
                }
            },
            //  {
            //     path: 'settlement',
            //     icon: 'clipboard',
            //     name: 'agents_settlement',
            //     title: '代理商结算对账',
            //     mixedRights: true,
            //     access: 0,
            //     component: resolve => {
            //         require(['./views/agents/settlement.vue'], resolve);
            //     }
            // },
             {
                path: 'account',
                icon: 'clipboard',
                name: 'agents_settlements',
                title: '结算中心',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/agents/account.vue'], resolve);
                }
            },
             {
                path: 'deposit',
                icon: 'clipboard',
                name: 'deposit',
                title: '代理商提现管理',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/agents/deposit.vue'], resolve);
                }
            },  
            {
                path: 'agentAudit',
                icon: 'clipboard',
                name: 'agentAudit',
                title: '代理商申请审核',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/agents/agentAudit.vue'], resolve);
                }
            },  
            // ,{
            //     path: 'cash',
            //     icon: 'android-clipboard',
            //     name: 'agents_QRCode',
            //     title: '代理商二维码管理',
            //     mixedRights: false,
            //     access: 1,
            //     component: resolve => {
            //         require(['./views/agents/QRCode.vue'], resolve);
            //     }
            // }
        ]
    },
    // 商城管理
    {
        path: '/management',
        icon: 'ios-cart',
        name: 'management',
        title: '商城管理',
        mixedRights: true,
        access: 0,
        component: Main,
        children: [
            {
                path: 'examinelist',
                // icon: 'ios-list-outline',
                name: 'examinelist',
                title: '审核商品',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/management/examinelist.vue'], resolve);
                }
            },
            {
                path: 'classify',
                // icon: 'ios-list-outline',
                name: 'classify',
                title: '分类管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/management/classify.vue'], resolve);
                }
            },
          
            {
                path: 'Reviewmanagement',
                // icon: 'ios-list-outline',
                name: 'Reviewmanagement',
                title: '商城评论管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/management/Reviewmanagement.vue'], resolve);
                }
            },
             {
                path: 'Reviewmanagements',
                // icon: 'ios-list-outline',
                name: 'Reviewmanagements',
                title: '商圈评论管理',
                mixedRights: true,
                component: resolve => {
                    require(['./views/management/Reviewmanagements.vue'], resolve);
                }
            },
            {
                path: 'Ordermanagement',
                name: 'Ordermanagement',
                title: '商城订单管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/management/Ordermanagement.vue'], resolve);
                }
            }
            ,
            {
                path: 'OrderWhitemanagement',
                name: 'OrderWhitemanagement',
                title: '白积分订单管理',
                mixedRights: true,
                access: 1,
                component: resolve => {
                    require(['./views/management/OrderWhitemanagement.vue'], resolve);
                }
            },
            {
                path: 'refund',
                name: 'OnlineReturnLists',
                title: '退货管理',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/management/refund.vue'], resolve);
                }
            }
        ]
    },
    // 资讯管理
    {
        path: '/news',
        icon: 'ios-paper-outline',
        name: 'news',
        title: '资讯管理',
        mixedRights: true,
        access: 0,
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'ios-list-outline',
                name: 'news_list',
                title: '管理资讯',
                mixedRights: true,
                access: 0,
                component: resolve => {
                    require(['./views/news/news.vue'], resolve);
                }
            }
        ]
    },

    //限额管理
     {
        path: '/amountMax',
        icon: 'pie-graph',
        name: 'amountMax',
        title: '限额管理',
        mixedRights: false,
        access: 1,
        component: Main,
        children: [
            {
                path: 'listamountMax',
                icon: 'settings',
                name: 'listamountMax',
                title: '企业会员申请',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/amountMax/listamountMax.vue'], resolve);
                }
            },
             {
                path: 'listamountMaxUser',
                icon: 'clipboard',
                name: 'listamountMaxUser',
                title: '限额申请',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/amountMax/listamountMaxUser.vue'], resolve);
                }
            }
        ]
    },
      //兑付方案
     {
        path: '/cashList',
        icon: 'compose',
        name: 'cashList',
        title: '兑付方案',
        mixedRights: false,
        access: 1,
        component: Main,
        children: [
            {
                path: 'List',
                icon: 'compose',
                name: 'List',
                title: '兑付方案',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/cashList/List.vue'], resolve);
                }
            }
        ]
    },
    //积分审核
     {
        path: '/integral',
        icon: 'settings',
        name: 'integral',
        title: '积分审核',
        mixedRights: false,
        access: 1,
        component: Main,
        children: [
            {
                path: 'Lists',
                icon: 'settings',
                name: 'Lists',
                title: '积分审核',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/integral/Lists.vue'], resolve);
                }
            }
        ]
    },

    // 创始会员
     {
        path: '/charterMember',
        icon: 'person-add',
        name: 'charterMember',
        title: '创始会员',
        mixedRights: false,
        access: 1,
        component: Main,
        children: [
            {
                path: 'Listss',
                icon: 'person-add',
                name: 'Listss',
                title: '创始会员',
                mixedRights: false,
                access: 1,
                component: resolve => {
                    require(['./views/charterMember/Listss.vue'], resolve);
                }
            }
        ]
    },
    // 数据统计

    // {
    //     path: '/dataStatistics',
    //     icon: 'calculator',
    //     name: 'dataStatistics',
    //     title: '数据统计',
    //     mixedRights: true,
    //     access: 0,
    //     component: Main,
    //     children: [
    //         {
    //             path: '/Recharge',
    //             icon: 'ios-list-outline',
    //             name: 'Recharge',
    //             title: '消费账号统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/Recharge.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/distribution',
    //             icon: 'ios-list-outline',
    //             name: 'distribution',
    //             title: '积分分发统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/distribution.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/withdrawal',
    //             icon: 'ios-list-outline',
    //             name: 'withdrawal',
    //             title: '提现统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/withdrawal.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/memberData',
    //             icon: 'ios-list-outline',
    //             name: 'memberData',
    //             title: '会员升级费用统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/memberData.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/award',
    //             icon: 'ios-list-outline',
    //             name: 'award',
    //             title: '奖励统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/award.vue'], resolve);
    //             }
    //         },

    //         {
    //             path: '/commission',
    //             icon: 'ios-list-outline',
    //             name: 'commission',
    //             title: '手续费统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/commission.vue'], resolve);
    //             }
    //         },

    //         {
    //             path: '/agentcost',
    //             icon: 'ios-list-outline',
    //             name: 'agentcost',
    //             title: '代理商费用统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/agentcost.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/discount',
    //             icon: 'ios-list-outline',
    //             name: 'discount',
    //             title: '折扣差统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/discount.vue'], resolve);
    //             }
    //         },
    //         {
    //             path: '/performance',
    //             icon: 'ios-list-outline',
    //             name: 'performance',
    //             title: '代理商业绩统计',
    //             mixedRights: true,
    //             access: 0,
    //             component: resolve => {
    //                 require(['./views/dataStatistics/performance.vue'], resolve);
    //             }
    //         },
    //          {
    //              path: '/dailifenh',
    //              icon: 'ios-list-outline',
    //              name: 'dailifenh',
    //              title: '代理商分红总数统计',
    //              mixedRights: true,
    //              access: 0,
    //              component: resolve => {
    //                 require(['./views/dataStatistics/dailifenh.vue'], resolve);
    //             }
    //          }


    //     ]
    // },
    // 工具
    // {
    //     path: '/instrument',
    //     icon: 'settings',
    //     name: 'instrument',
    //     title: '小工具',
    //     mixedRights: false,
    //     access: 1,
    //     component: Main,
    //     children: [
    //         {
    //             path: 'IntegralDistribution',
    //             icon: 'document-text',
    //             name: 'IntegralDistribution',
    //             title: '积分分发',
    //             mixedRights: false,
    //             access: 1,
    //             component: resolve => {
    //                 require(['./views/instrument/IntegralDistribution.vue'], resolve);
    //             }
    //         }
    //     ]
    // },

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    // preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
