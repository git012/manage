import Env from './env';
import Md5 from '../libs/md5';
// 测试环境
//     const server_route = "http://tapi.yugoubao.net/index.php?s=";
//正式环境
const server_route = "https://wktapi.yugoubao.net/index.php?s=";
const powerList = {};
let config = {
    powerList:powerList,
    env: Env,
    apiRootPath: server_route,
    public:{
        qiniuUrl:"http://p064icdxu.bkt.clouddn.com/"
    },
    api: {
        "login": {
            "request": "wkManager/Logon/managerLogin", //login.vue  3db0d2909b6e9745d28281a35aecccbb
            "CodeImage": "wkManager/Logon/loginCode" //login.vue
        },
        "public": {
            "merchantType": "wkmanager/merchant/types", //login.vue wkmanager/merchant/types
            "editerUpload": "wkmanager/Upload_Files/pic", //login.vue
            "getProvince": "wkmanager/area/provinceLists",
            "getCity": "wkmanager/area/cityLists",
            "getDistrict": "wkmanager/area/districtLists",
            "ewm":"wkclient/merchant/createQRCode"//login.vue
        },
        "main": {
            "modifyPassword": "wkmanager/manager_user/updateUserPassword",

        },
        "home_index": {
            "count": "wkmanager/statistic/bases", //home/home.vue
        },
        "own_space": {
            "detail": "wkmanager/manager_user/view", //home/home.vue
            "edit": "wkmanager/manager_user/edit",
            "modifyPassword": "wkmanager/manager_user/updateUserPassword"
        },

        //数据统计
        "dataStatistics":{
            //消费账号统计
            "Recharge":{
                //充值金额统计
                "list":"wkmanager/statistic/rechargeTotal",
                //充值统计导出
                "Dw":'wkmanager/statistic/rechargetotalexport',

                //购物积分统计
                "jf":"wkmanager/statistic/shoppingTotal",
                //购物积分统计导出
                "jfDw":"wkmanager/statistic/shoppingtotalexport",

                //预购充值金额统计
                "reg":"wkmanager/statistic/preRechargeTotal",
                //预购充值统计导出
                "regDw":'wkmanager/statistic/prerechargetotalexport',

                //预存款账户转预购充值统计
                "R":"wkmanager/statistic/memberCashToShoppingTotal",
                //预存款账户转预购充值统计导出
                "RDw":"wkmanager/statistic/membercashtoshoppingtotalexport",

            },
            //代理商业绩统计
            "performance":{
              "list":"wkmanager/statistic/agentAchievementTotal",
                "dw":"wkmanager/statistic/agentachievementtotalexport",
            },
            //代理商分红总数统计
            "dailifenh":{
                "list":"wkmanager/statistic/agentBonusTotal",
                "dw":"wkmanager/statistic/agentbonustotalexport",
            },
            //会员升级费用统计
            "memberData":{
                "list":"wkmanager/statistic/memberUpTotal",
                "dw":"wkmanager/statistic/memberUpExport"
            },
            //积分分发统计
            "distribution":{
                //会员积分
                "list":"wkmanager/member/statisticmemberdistribute",
                "dw":'wkmanager/member/statisticmemberdistributeexport',
                //商户
                "slist":"wkmanager/member/statisticmerchantdistribute",
                "sDw":"wkmanager/member/statisticmerchantdistributeexport"
            },
            //提现统计
            "withdrawal":{
                "list":"wkmanager/statistic/memberWithdrawTotal",
                "dw":"wkmanager/statistic/memberwithdrawtotalexport",
                "slist":"wkmanager/statistic/merchantWithdrawTotal",
                "sDw":"wkmanager/statistic/merchantwithdrawtotalexport",
            },
            //奖励统计
            "award":{
                "list":"wkmanager/reward_statistic/sharestatistic",
                //代理推荐奖励明导出
                "listDw":"wkmanager/reward_statistic/recommendagentexport",
                "reg":"wkmanager/reward_statistic/recommendagentstatistic",
                //分享奖励导出
                "regDw":"wkmanager/reward_statistic/shareexport",
                "jf":"wkmanager/reward_statistic/recommendmemberstatistic",
                //会员推荐奖励导出
                "jfDw":"wkmanager/reward_statistic/recommendmemberexport",
            },
            //手续费统计
            "commission":{
                "list":"wkmanager/statistic/serviceChargeTotal",
                'dw':"wkmanager/statistic/servicechargetotalexport",
            },
            //代理商费用
            "agentcost":{
                "list":"wkmanager/statistic/agentTotal",
                'dw':"wkmanager/statistic/agentTotalExport"
            },
            //折扣差统计
            "discount":{
                "list":"wkmanager/statistic/discountsTotal",
                'dw':"wkmanager/statistic/discountsTotalExport"
            }
        },
        //系统管理
        "system": {
            // //区域管理
            // "system_area": {
            //     "list": "wkmanager/permission/groupLists", //login.vue
            //     "edit": "wkmanager/permission/groupUpdate", //login.vue
            //     "add": "wkmanager/permission/groupCreate", //login.vue
            //     "delete": "wkmanager/permission/groupDelete"
            // },
            //部门管理
            "admin_department": {
                "list": "wkmanager/permission/groupLists", //login.vue
                "edit": "wkmanager/permission/groupUpdate", //login.vue
                "add": "wkmanager/permission/groupCreate", //login.vue
                "delete": "wkmanager/permission/groupDelete",
                "rights": "wkmanager/permission/lists"
            },
            //账户分配
            "admin_assignments": {
                "list": "wkmanager/manager_user/lists", //login.vue
                "detail": "wkmanager/manager_user/view", //login.vue
                "edit": "wkmanager/manager_user/edit", //login.vue
                "add": "wkmanager/manager_user/add", //login.vue
                "delete": "wkmanager/manager_user/updateUserStatus", //login.vue
                "modifyPassword": "wkmanager/manager_user/updateUserPassword" //login.vue
            }
        },
        //用户管理
        "user": {
            "user_list":{
                "k": "wkmanager/agent_binding_card/bindingMemberCards",
                "newAdd": "wkmanager/member/updatememberscore",
                "klist":"wkmanager/member/bindingMemberCardsLists",
                "jb":"wkmanager/member/cancelMemberCards",
                "list": "wkmanager/memberinfo/lists", //login.vue
                "view": "wkmanager/memberinfo/detail", //login.vue
                "edit": "wkmanager/memberinfo/edit", //login.vue
                "delete": "wkmanager/memberinfo/delete" //login.vue
            },
            "real_name_authentication":{
                "list": "wkmanager/member_authentication/lists", //login.vue
                "authentication": "wkmanager/member_authentication/authentication"
            },
            //用户结算对账
            "user_settlement": {
                "account_list"              : "wkmanager/memberinfo/listScore",
                "userConsumeBonusesList"    : "wkmanager/score/member_red_score",//红积分
                "userConsumeBonusesToExcel" : "wkmanager/score/amountList",
                "userBuyIntegralList"       : "wkmanager/score/member_shopping_score",//购物积分
                "userBuyIntegralToExcel"    : "wkmanager/score/shoppingList",
                "userReturnIntegralList"    : "wkmanager/score/member_white_score",//白积分
                "userReturnIntegralToExcel" : "wkmanager/score/shareList",
                "userAgentBonusesList"      : "wkmanager/score/agentList",//代理分红
                "userAgentBonusesToExcel"   : "wkmanager/score/agentList",
                "userRechargeList"          : "wkmanager/recharge/lists",//充值
                "userRechargeListToExcel"   : "wkmanager/recharge/lists",
                "userCashAccountList"       : "wkmanager/cash_account_record/lists",//预存账户
                "userCashAccountToExcel"    : "wkmanager/cash_account_record/lists",
                "userPreRechargeList"                       : "wkmanager/recharge/preList",//预购充值
                "userPreRechargeListToExcel"                : "wkmanager/recharge/preList",
                "userConsumeBonusesForPreRechargeList"      : "wkmanager/score/amountList",//预购充值的消费增值积分
                "userConsumeBonusesForPreRechargeToExcel"   : "wkmanager/score/amountList",
                "userBuyIntegralForPreRechargeList"         : "wkmanager/score/shoppingList",//预购充值的购物积分
                "userBuyIntegralForPreRechargeToExcel"      : "wkmanager/score/shoppingList",
                "userReturnIntegralForPreRechargeList"      : "wkmanager/score/shareList",//预购充值的全返积分
                "userReturnIntegralForPreRechargeToExcel"   : "wkmanager/score/shareList",
                "userRecharge"                              : "wkmanager/cash_account_record/recharge"//线下充值
            },
            //会员奖励统计
            "user_reward": {
                "list": "wkmanager/member/memberRewardTotal"
            },
            //用户订单
            "user_orders": {
                "list": "wkmanager/order/memberLists",
                "toExcel": "wkmanager/order/listsExport"
            },
            //用户提现
            "user_cash": {
                'dw':"wkmanager/statistic/cashListExport",
                "list": "wkmanager/member/withdrawCashList",
                "review": "wkmanager/member/withdrawAudit",
                "toExcel": "wkmanager/member/withdrawCashListExport",
                "userInfro": "wkmanager/memberinfo/detail"
            },
            //积分分发
            "integral":{
              "list":"wkmanager/member/getDistributeMemberList",

            },
            "IntegralDistribution":{
                "IntegralDistribution":"wkmanager/reward_statistic/scorehandle",//积分分发工具
            },

            //线下充值审核
            "linerecharge":{
                "list":"wkmanager/member_offline_transfer_apply/lists",
                "review":"wkmanager/member_offline_transfer_apply/audit"
            }
        },
        //代理商管理
        "agents": {
            //代理商信息
            "agents_list":{
                "list": "wkmanager/agent/lists", //login.vue
                "detail": "wkmanager/agent/details", //login.vue
                "edit": "wkmanager/agent/edit", //login.vue
                // "add": "wkmanager/agent/create", //login.vue
                // "review": "wkmanager/agent/updateStatus", //login.vue
                "manageChild": "wkmanager/agent_member/lists", //login.vue
                "shareScale": "wkmanager/agent_shareholder_conf/view", //login.vue
                "shareScaleAdd": "wkmanager/agent_shareholder_conf/add", //login.vue
                "shareScaleEdit": "wkmanager/agent_shareholder_conf/edit", //login.vue
                "addChild": "wkmanager/agent_member/add", //login.vue
                "editChild": "wkmanager/agent_member/add", //login.vue
                "viewChild": "wkmanager/agent_member/lists", //login.vue
                "cardList": "wkmanager/agent_member/agentMemberCards", //login.vue
                "giveChildCard": "wkmanager/agent_binding_card/add", //login.vue
                "unBindChildCard": "wkmanager/agent_member/cancelAgentMemberCards"
            },
            //代理商结算
            "agents_settlement": {
                "list": "wkmanager/agent_share_settlement/settlementList",
                "shareBonusList": "wkmanager/agent_share_settlement/shareDetails",
                "settlementList": "wkmanager/agent_share_settlement/settlementDetails",
                "settlement": "wkmanager/agent_share_settlement/settlement"
                // "agentsShareBonusToExcel": "wkmanager/agents/listsExport"
            },
            //代理商提现
            "agents_QRCode": {
                "list": "wkmanager/agents/withdrawCashList",
                "agentsInfro": "wkmanager/agents/details",
                "review": "wkmanager/agents/withdrawAudit",
                "toExcel": "wkmanager/agents/withdrawCashListExport"
            },

             "agents_settlements": {
                "userConsumeBonusesList"    : "wkmanager/score/agent_red_score",//红积分
                "userBuyIntegralList"       : "wkmanager/score/agent_shopping_score",//购物积分
                "userReturnIntegralList"    : "wkmanager/score/agent_white_score",//白积分
                "account_list"				: "wkmanager/agent_share_settlement/settlementList",
                "usermeb_list"				: "wkmanager/agent/getagentmembermonthsettlementlist",
                "sharebonusButton"			: "wkmanager/agent/payforbouns",
            },
            //代理商提现管理列表
             "agents_depositList": {
                "depositList"    : "wkmanager/agent/agentmembercashlist",//列表
                "depositListButton"    : "wkmanager/agent/updatecashstatus",//列表操作
            }, 
            //代理商申请列表
             "agentAudit": {
                "agentAuditList"    : "wkmanager/Agent_member/lists_log",//列表
                "agentAuditListButton"    : "wkmanager/Agent_member/updateStatus",//列表操作
            },   
        },
        //商户管理
        "merchant": {
            //商户信息
            "merchant_list":{
                "list": "wkmanager/merchant/lists", //login.vue
                "detail": "wkmanager/merchant/details", //login.vue
                "edit": "wkmanager/merchant/update", //login.vue
                "add": "wkmanager/merchant/create", //login.vue
                "type":"wkmanager/merchant/types",
                "delete": "wkmanager/merchant/updateStatus", //login.vue
                "review": "wkmanager/merchant/updateStatus",
                "reviewApp": "wkmanager/merchant/updateStatusApp"
            },
            //商户订单
            "merchant_orders": {
                "list": "wkmanager/order/merchantLists",
                "fahuo": "wkmanager/order/updateordershipstatus",
                "toExcel": "wkmanager/order/listsExport"
            },
            //商户提现
            "merchant_cash": {
                "list": "wkmanager/merchant/withdrawCashList",
                "merchantInfro": "wkmanager/merchant/details",
                "review": "wkmanager/merchant/withdrawAudit",
                "toExcel": "wkmanager/merchant/withdrawCashListExport"
            },
            "merchant_jfintegral":{
                "list":"wkmanager/member/getDistributeMerchantList",

            },
            "merchant_settlement": {
                "userConsumeBonusesList"    : "wkmanager/score/merchant_red_score",//红积分
                "userBuyIntegralList"       : "wkmanager/score/merchant_shopping_score",//购物积分
                "userReturnIntegralList"    : "wkmanager/score/merchant_white_score",//白积分
                "account_list":"wkmanager/merchant/lists",
                "turnoverList":"wkmanager/merchant/withdrawCashlists",//营业款账户(出)
                "turnoverListGet":"wkmanager/merchant/recordLists",//营业款账户(入)
            },
            // ,
            // //商户积分分发
            // "merchant_integral": {
            //     "list": "wkmanager/merchant/withdrawCashList"
            // }
        },

        //商城管理
        "management":{
            "examinelist":{
                "list":"wkmanager/product/lists",
                "review":"wkmanager/product/updateStatus",
                't':"wkmanager/product/setRecommend",
                'h':"wkmanager/product/setDiscount"
            },
            //评论管理
            "Reviewmanagement":{
                "list":"wkmanager/review/getreviewlist",
                "review":"wkmanager/review/updatestatus",
            },
            //商圈评论管理
            "Reviewmanagements":{
                "list":"wkmanager/review/getbusinessreviewlist",
                "review":"wkmanager/review/updatestatusbusiness",
            },
            //分类管理
            "classify":{
                "list":"wkmanager/Category/getLists",
                "add":"wkmanager/category/add",
                "delete":"wkmanager/category/delete",
                "edit":"wkmanager/category/edit",
                "lists":"wkmanager/Category/getLists",
            },
            //退款管理
            "OnlineReturnLists":{
                "list":"wkmanager/online_return/lists"
            },
            //订单管理
            "Ordermanagement":{
                "list":"wkmanager/online_order/lists",
                "view":'wkmanager/online_order/view',
                "queryShip":'wkmanager/product/getOrderTracesByJson',
            },
           //白积分订单
            "OrderWhitemanagement":{
                "list":"wkmanager/Online_Order_White/lists",
                "view":'wkmanager/Online_Order_White/view'
            }

        },
        //资讯管理
        "news": {
            "news_list": {
                "list": "wkmanager/news/lists", //login.vue
                "detail": "wkmanager/news/view", //login.vue
                "edit": "wkmanager/news/edit", //login.vue
                "add": "wkmanager/news/add", //login.vue
                "delete": "wkmanager/news/delete",
                "review": "http://manage.yugoubao.net/article/?type=news&id="
            }
        },
        //限额管理amountMax.listamountMax
        "amountMax":{
            "listamountMax":{
                "list":"wkmanager/apply_amount_max/lists",
                "review":"wkmanager/apply_amount_max/review",
            }
        },
        "cashList":{
            "List":{
                "list":"wkmanager/redemption_plan/lists",//列表
                "add":"wkmanager/redemption_plan/add",//添加
                
                "review":"wkmanager/redemption_plan/audit",//兑付方案审核
               
            }
        },
        "integral":{
            "List":{
                "list":"wkmanager/member/businessmemberwhitescorelist",
                "lists":'wkmanager/member/getdirectlist',
                "review":"wkmanager/member/auditbusinessmemberwhitescore",//
            }
        },
        "charterMember":{
              "List":{
                "list":"wkmanager/creation_member/lists",
                "add":"wkmanager/creation_member/add",//添加
                "newAdd":'wkmanager/Creation_Member/addscore'//增加积分
            }
        }

    },
    errorCode: {
        "runOut" : {
            num: 1111,
            text: "登录超时，请重新登录！"
        } //登录超市
    },
    showError (errorObj) {
        if(!!errorObj.data&&errorObj.data.code==this.errorCode.runOut.num){
            errorObj.vm.$store.commit('logout',errorObj.vm);
        }else{
            if(!!errorObj.data&&errorObj.data.code!=0){
                errorObj.vm.$Message.error(errorObj.errorMsg+" "+errorObj.data.message);
            }else{
                errorObj.vm.$Message.error(errorObj.errorMsg);
            };


        }
    }
};

export default config;
