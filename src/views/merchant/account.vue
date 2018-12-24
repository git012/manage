<style lang="less">
    @import './settlement.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .item-list{ line-height: 30px; width:100%}
    .item-list .item-title{ font-weight: 900; text-align:right; background:#f5f5f5; padding: 0 6px; width:130px; color:#666}
    .item-list .item-content{  text-align:left; background:#fafafa; padding: 0 6px}
    .buttonGroup{ text-align:right}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small" 
                    v-if="doType!='account_list'" 
                    @click="doWhat('account_list')" >返回商户列表
                </Button>
               
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <component v-if="doType!='account_list'" @doWhat="doWhat" :preRechargeData="preRechargeData" :param="paramData" :publicData="publicData" :is="currentView">
                    <!-- 非活动组件将被缓存！ -->
                </component>
                <div class="ordler-list" v-if="doType=='account_list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入用户名搜索帐号">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch()">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                    <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                    <Modal v-model="isRecharge" :closable='false' :mask-closable=false :width="500">
                        <h3 slot="header" style="color:#2D8CF0">线下充值</h3>
                        <Form ref="rechargeForm" :model="rechargeForm" :label-width="100" label-position="right" :rules="rechargeValidate">
                            <FormItem label="用户名：">
                                {{rechargeForm.name}}
                            </FormItem>
                            <FormItem label="金额：" prop="money">
                               <div style="width:150px; display:inline-block;margin-right:5px"><Input v-model="rechargeForm.money" ></Input></div>  {{ fmoney(rechargeForm.money,2) }} 元
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="text" @click="cancelRecharge()">取消</Button>
                            <Button type="primary" :loading="saveRechargeLoading" @click="saveRecharge()">保存</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
import ConsumeBonuses from './settlement/ConsumeBonuses.vue';//红积分
import AgentBonuses from './settlement/AgentBonuses.vue';
import BuyIntegral from './settlement/BuyIntegral.vue';
import CashAccount from './settlement/CashAccount.vue';
import ReturnIntegral from './settlement/ReturnIntegral.vue';
import turnover from './settlement/turnoverList.vue';//营业额明细
import Recharge from './settlement/Recharge.vue';
import PreRecharge from './settlement/PreRecharge.vue';
import ConsumeBonusesForPreRecharge from './settlement/ConsumeBonusesForPreRecharge.vue';
import BuyIntegralForPreRecharge from './settlement/BuyIntegralForPreRecharge.vue';
import ReturnIntegralForPreRecharge from './settlement/ReturnIntegralForPreRecharge.vue';
import red from './settlement/red.vue';
import MD5 from '../../libs/md5';
export default {
    name: 'account',
    components: {   
        ConsumeBonuses : ConsumeBonuses,
        BuyIntegral : BuyIntegral,
        Recharge : Recharge,
        ReturnIntegral : ReturnIntegral,
        turnover:turnover,
        CashAccount : CashAccount,
        AgentBonuses : AgentBonuses,
        PreRecharge : PreRecharge,
        ConsumeBonusesForPreRecharge : ConsumeBonusesForPreRecharge,
        BuyIntegralForPreRecharge : BuyIntegralForPreRecharge,
        ReturnIntegralForPreRecharge : ReturnIntegralForPreRecharge,
        red:red,
    },
    data () {
        return {
            paramData:{},  
            preRechargeData:{},    
            currentView:"ConsumeBonuses",
            publicData:{
                user_sex:["未知","男","女"],
                is_shareholder:["非股东","股东"],
                is_agent:["非代理","代理"],
                userTypeData: ["普通会员","分享合伙人","事业合伙人"]
            },
            columns: [
               {
                    title: 'ID',
                    // width: "60",
                    align: 'center',
                    key: 'merchantId'
                },
                {
                    title: '帐号',
                    key: 'userName'
                },
                {
                    title: '商户名称',
                    key: 'merchantName'
                },
                {
                    title: '联系人',
                    // width: "6%",
                    key: 'applicantName'
                },
                {
                    title: '商户电话',
                    // width: "94",
                    key: 'merchantPhone'
                },
                {
                    title: '地区',
                    key: 'merchantProvinceId',
                    render: (h, params) => {
                        let tagText=params.row.merchantProvinceName+params.row.merchantCityName+params.row.merchantDistrictName;
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '分享人',
                    align: 'center',
                    // width: "94",
                    key: 'merchantBDName'
                },
                {
                    title: '商户类型',
                    align: 'center',
                    // width: "94",
                    key: 'merchantTypeName'
                },
                // {
                //     title: '商户类型',
                //     key: 'merchantType',
                //     // width: "66",
                //     align: 'center',
                //     render: (h, params) => {
                //         let tagcolor="default";
                //         let tagText="";
                //
                //         $.each(this.merchantTypeData,(small_index, small_el)=>{
                //             if(params.row.merchantType==small_el.value)tagText=small_el.label
                //         })
                //         return h('span', {}, tagText);
                //     }
                // },
                {
                    title: '订单',
                    // width: "5%",
                    align: 'center',
                    key: 'orderSuccessCount'
                },
                // {
                //     title: '余额',
                //     align: 'right',
                //     key: 'merchantTotalCash'
                // },
                {
                    title: '总金额',
                    align: 'center',
                    key: 'merchantTotalCash'
                },
                {
                    title: '购物积分',
                    align: 'center',
                    key: 'merchantShoppingScore'
                },
                {
                    title: '白积分',
                    align: 'center',
                    key: 'merchantWhiteScore'
                },
                {
                    title: '红积分',
                    align: 'center',
                    key: 'merchantRedScore'
                },
                {
                    title: '状态',
                    key: 'applicantStatus',
                    // width: "80",
                    align: 'center',
                    render: (h, params) => {

                        let tagcolor="default";
                        let tagText="审核中";
                        if(params.row.applicantStatus==1){
                            tagcolor="green";tagText="已通过";
                        };
                        if(params.row.applicantStatus==2){
                            tagcolor="red";tagText="已拒绝";
                        };
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 220,
                    align: 'center',
                    render: (h, params) => {
                        let viewButton=h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("userAccountList",params.index)
                                    }
                                }
                            }, '账户明细');
                      
                        let dobutton=[];

                        if(
                            this.checkPower("userConsumeBonusesList")
                            ||this.checkPower("userBuyIntegralList")
                            ||this.checkPower("userReturnIntegralList")
                            ||this.checkPower("userAgentBonusesList")
                            ||this.checkPower("userRechargeList")
                            ||this.checkPower("userCashAccountList")
                        ){
                            dobutton.push(viewButton);
                        };
                      
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            doType:"account_list",
            switching:false,
            tableData: [],
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[]
            },
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:0,
            currentData: {},
            defaultData:{
                "id": "",
                "name": "",
                "mobile": "",
                "status": "",
                "level": "",
                "share_member_id": "",
                "amount_score": "",
                "shopping_score": "",
                "created": "",
                "amount_max": "",
                "yun_account": "",
                "yun_account_status": "",
                "id_card": ""
            },
            rechargeValidate: {
                money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ]
            },
            isRecharge:false,
            saveRechargeLoading:false,
            rechargeForm:{
                name:"",
                money:""
            },
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:0
            },
            searchValidata: {}
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        },
        areaDataReady () {
            return !(this.areaData.areaDataReady==0);
        },
        isShowAccountListButtonGroup () {
            if (
                this.doType=="userConsumeBonusesList"   ||
                this.doType=="userBuyIntegralList"      ||
                this.doType=="userReturnIntegralList"   ||
                this.doType=="userAgentBonusesList"     ||
                this.doType=="userRechargeList"         ||
                this.doType=="userCashAccountList"
                ) return true;
            return false;
        },
        doName () {
            if (this.doType=="userConsumeBonusesList")  return "用户结算对账 - 红积分 - " + this.paramData.merchantName;//红积分
            if (this.doType=="userBuyIntegralList")     return "用户结算对账 - 购物积分 - " + this.paramData.merchantName;
            if (this.doType=="userReturnIntegralList")  return "用户结算对账 - 白积分 - " + this.paramData.merchantName;
            if (this.doType=="userAgentBonusesList")    return "用户结算对账 - 代理分红 - " + this.paramData.name;
            if (this.doType=="userRechargeList")        return "用户结算对账 - 充值 - " + this.paramData.name;
            if (this.doType=="userCashAccountList")     return "用户结算对账 - 预存款账户 - " + this.paramData.name;
            if (this.doType=="userPreRechargeList")     return "用户结算对账 - 预购充值 - " + this.paramData.name;
            if (this.doType=="userConsumeBonusesForPreRechargeList")return "用户结算对账 - 预购充值 - " + this.paramData.name + " - 消费增值积分";
            if (this.doType=="userBuyIntegralForPreRechargeList")   return "用户结算对账 - 预购充值 - " + this.paramData.name + " - 购物积分";
            if (this.doType=="userReturnIntegralForPreRechargeList")return "用户结算对账 - 预购充值 - " + this.paramData.name + " - 全返积分";
            return "用户结算对账";
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.merchant.merchant_settlement[dotype].MD5()];
        },

        // "userConsumeBonusesList"    : "wkmanager/score/merchant_red_score",//红积分
        //  "userBuyIntegralList"       : "wkmanager/score/merchant_shopping_score",//购物积分
        // "userReturnIntegralList"    : "wkmanager/score/merchant_white_score",//白积分
        doWhat (dotype,dataIndex) {
            // let dotype=dotype;
            console.log(this.tableData[dataIndex]);
            if(dotype=="userAccountList"){
                if(this.checkPower("userConsumeBonusesList")){
                    dotype="userConsumeBonusesList";
                }else if(this.checkPower("userBuyIntegralList")){
                    dotype="userBuyIntegralList";
                }else if(this.checkPower("userReturnIntegralList")){
                    dotype="userReturnIntegralList";
                }else{
                	dotype="turnoverList";
                }
            };

           

            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            this.switching=true;
            if(dotype=="userConsumeBonusesList"){//红积分
            	console.log(666,dataIndex,this.tableData[dataIndex])
                console.log(this.tableData[dataIndex]);
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="ConsumeBonuses";
                this.doType="userConsumeBonusesList";
            };
            if(dotype=="userBuyIntegralList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="BuyIntegral";
                this.doType="userBuyIntegralList";
            };
            if(dotype=="turnoverList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="turnover";
                this.doType="turnoverList";
            };
            if(dotype=="userReturnIntegralList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="ReturnIntegral";
                this.doType="userReturnIntegralList";
            };
            if(dotype=="userAgentBonusesList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="AgentBonuses";
                this.doType="userAgentBonusesList";
            };
            if(dotype=="userRechargeList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="Recharge";
                this.doType="userRechargeList";
            };
            if(dotype=="userCashAccountList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="CashAccount";
                this.doType="userCashAccountList";
            };
            if(dotype=="userPreRechargeList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="PreRecharge";
                this.doType="userPreRechargeList";
            };

            if(dotype=="userConsumeBonusesForPreRechargeList"){
                if(dataIndex)this.preRechargeData=dataIndex;
                this.currentView="ConsumeBonusesForPreRecharge";
                this.doType="userConsumeBonusesForPreRechargeList";
            };
            if(dotype=="userBuyIntegralForPreRechargeList"){
                if(dataIndex)this.preRechargeData=dataIndex;
                this.currentView="BuyIntegralForPreRecharge";
                this.doType="userBuyIntegralForPreRechargeList";
            };
            if(dotype=="userReturnIntegralForPreRechargeList"){
                if(dataIndex)this.preRechargeData=dataIndex;
                this.currentView="ReturnIntegralForPreRecharge";
                this.doType="userReturnIntegralForPreRechargeList";
            };


            if(dotype=="account_list"){
                this.resetCurrentData();
                this.dataReady++;
                this.init();
                this.doType="account_list";
            };
            this.switching=false;
        },
        //comm
        fmoney : Util.fmoney,
        resetCurrentData () {
            this.currentData = $.extend(true, {}, this.defaultData);
        },
        changePage (pageNumber){
            this.page.pageNumber=pageNumber;
            this.search(pageNumber);
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        //list
        resetSearch () {
            this.searchData={
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:0
            };
            this.page.pageNumber=1;
            this.dataReady++;
            this.init();
        },
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };
            this.page.pageNumber=1;
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.doWhat("account_list");
        },
        init () {
            this.getList();
        },
        getList () {
            this.tableData=[];
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
            if(this.searchData.type!="")postData.type=this.searchData.type;
            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_settlement.account_list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.dataReady--;
                // getList
                if(!!data){
                    if(data.code==0){
                        this.page.dataCount=data.data.count;
                        this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                        //format list data
                        let listData=data.data.list;
                        listData.forEach((item)=>{
                            if(!item.merchantBDName)item.merchantBDName="";
                            if(!item.merchantBDId)item.merchantBDId="";
                            item.merchantYgbAccount=item.merchantYgbName;
                        });
                        this.tableData=listData;

                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"请求失败"
                    });
                }
            })
            .fail((xhr,status,error)=>{
                this.dataReady--;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });

            
        },
        //view
         view (index) {
            this.currentData=$.extend(true, {}, this.tableData[index]);
            this.viewDataReady=false;
            this.getDetail(this.currentData.id);
            this.viewUser=true;
        },
        closeView (){
            this.viewUser=false;
        },
        getDetail (member_id) {
            let postData={
                ssid:Cookies.get('ssid'),
                member_id:member_id
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_settlement.view,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.viewDataReady=true;     
                // getList
                if(!!data){
                    if(data.code==0){
                        this.currentData=data.data;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"请求失败"
                    });
                }
            })
            .fail((xhr,status,error)=>{
                this.viewDataReady=true;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
            
        },
        //add && edit
        showRecharge (index) {
            this.isRecharge=true;
            this.rechargeForm={
                name:this.tableData[index].name,
                money:0
            };
        },
        cancelRecharge (index) {
            this.isRecharge=false;
            this.rechargeForm={
                name:"",
                money:""
            };
        },
        saveRecharge () {

            this.$refs['rechargeForm'].validate((valid) => {

                if (valid) {
                    this.switching = true;

                    var postData = {
                        ssid  : Cookies.get('ssid'),
                        name  : this.rechargeForm.name,
                        money : this.rechargeForm.money
                    };

                    let requestUrl=Config.apiRootPath+Config.api.user.user_settlement.userRecharge;
        

                    let _this=this;
                    //拉取用户类型
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.switching=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("线下充值成功！");
                                this.doWhat("account_list");
                                this.isRecharge=false;
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.switching=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            })
        }
    },
    mounted () {
    },
    activated (){
        this.doWhat("account_list");   
    }
};
</script>