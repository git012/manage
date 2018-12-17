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
                    v-if="checkPower('list')&&doType!='list'" 
                    @click="doWhat('list')" >返回代理商列表
                </Button>
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <component v-if="doType!='list'" @doWhat="doWhat" :param="paramData" :publicData="publicData" :is="currentView">
                        <!-- 非活动组件将被缓存！ -->
                </component>
                <div v-if="doType=='list'"  class="ordler-list">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入用户名搜索帐号">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <Date-picker type="month" v-model="searchData.searchDate" placeholder="选择未结算月份" style="width: 200px"></Date-picker>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>

                    <Table 
                        class="small_table"
                        border 
                        :columns="columns" 
                        :loading="getLoading" 
                        :data="tableData">
                    </Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
import shareBonus from './settlement/shareBonus.vue';
import settlement from './settlement/settlement.vue';


export default {
    name: 'agents_settlement',
    components: {   
        shareBonus : shareBonus,
        settlement : settlement
    },
    data () {
        return {
            paramData:{},  
            preRechargeData:{},    
            currentView:"shareBonus",
            publicData:{
                user_sex:["未知","男","女"],
                is_shareholder:["非股东","股东"],
                is_agent:["非代理","代理"],
                userTypeData: ["未知","全球总代理","省代理","市代理","区县代理","其他"],
                settlementStatusData: ["未知","未核算","已核算"],
                shareBonusStatus:["未知","转入","转出"]
            },
            columns: [
                {
                    title: 'ID',
                    // width: "60",
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '代理名称',
                    key: 'agent_name'
                },
                {
                    title: '代理公司名称',
                    key: 'enterprise_name',
                    // width: "20%",
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, "  ");
                    }
                },
                {
                    title: '代理商类型',
                    key: 'type',
                    // width: "20%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.publicData.userTypeData[params.row.type]);
                    }
                },
                {
                    title: '分润积分总额',
                    align: 'right',
                    key: 'agent_score'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
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
                                        this.doWhat("shareBonusList",params.index)
                                    }
                                }
                            }, '分红明细');
                        let settlementButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("settlementList",params.index)
                                    }
                                }
                            }, '结算');

                        let dobutton=[];

                        if(this.checkPower("shareBonusList")){
                            dobutton.push(viewButton);
                        };
                        if(this.checkPower("settlementList")){
                            dobutton.push(settlementButton);
                        };
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            doType:"list",
            switching:false,
            tableData: [],
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
                "type": "",
                "province_id": "",
                "city_id": "",
                "district_id": "",
                "agent_name": "",
                "enterprise_name": "",
                "address": "",
                "tel": "",
                "business_licence_image": "",
                "share_member_ratio": "",
                "share_company_ratio": "",
                "share_bd_ratio": "",
                "parent_id": "",
                "date_added": "",
                "is_lock": "",
                "agent_score": "",
                "juridical_person": "",
                "juridical_person_card": "",
                "juridical_person_card_image": ""
            },
            rechargeForm:{
                name:"",
                money:""
            },
            searchData:{
                keyword:"",
                searchDate:"",
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
        doName () {
            if (this.doType=="shareBonusList")  return "代理商结算对账 - 分红明细 - " + this.paramData.agent_name;
            if (this.doType=="settlementList")  return "代理商结算对账 - 结算明细 - " + this.paramData.agent_name;
            return "代理商结算对账";
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.agents.agents_settlement[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {

            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            this.switching=true;

            if(dotype=="list"){
                this.resetCurrentData();
                this.dataReady++;
                this.init();
                this.doType="list";
            };
            if(dotype=="shareBonusList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="shareBonus";
                this.dataReady++;
                this.shareBonusInit();
                this.doType="shareBonusList";
            };
            if(dotype=="settlementList"){
                if(dataIndex>=0)this.paramData=this.tableData[dataIndex];
                this.currentView="settlement";
                this.dataReady++;
                this.settlementListInit();
                this.doType="settlementList";
            };
            if(dotype=="settlement"){
                this.settlement(this.tableData[dataIndex]);
            };
            this.switching=false;
        },
        //comm
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
                searchDate:"",
                startDate:"",
                endDate:"",
                type:0
            };
            this.page.pageNumber=1;
            this.dataReady++;
            this.init();
        },
        search (pageNumber) {
            // if(this.searchData.searchDate.length){
            //     this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
            //     this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            // }
            this.page.pageNumber=1;
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.doWhat(this.doType);
        },
        accountList () {

        },
        init () {
            this.getList();
        },
        getList () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.name=Util.trim(this.searchData.keyword);
            if(this.searchData.searchDate!="")postData.years=this.searchData.searchDate.getFullYear();
            if(this.searchData.searchDate!="")postData.months=this.searchData.searchDate.getMonth();

            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_settlement.list,
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
                        this.tableData=data.data.list;
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
        //shareBonus
        shareBonusInit () {
            this.getShareBonusList();
        },
        getShareBonusList () {
            let postData={
                ssid:Cookies.get('ssid'),
                agent_id:this.currentData.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };

            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_settlement.shareBonusList,
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
                        this.tableData=data.data.list;
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
        //settlementList
        settlementListInit () {
            this.getSettlementList();
        },
        getSettlementList () {
            let postData={
                ssid:Cookies.get('ssid'),
                agent_id:this.currentData.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };

            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_settlement.settlementList,
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
                        this.tableData=data.data.list;
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
                url: Config.apiRootPath+Config.api.agents.agents_settlement.view,
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
        //settlement
        settlement (settlementItemData) {
            if(settlementItemData&&settlementItemData.id){

                this.switching = true;

                var postData = {
                    ssid  : Cookies.get('ssid'),
                    id : settlementItemData.id
                };

                let requestUrl=Config.apiRootPath+Config.api.agents.agents_settlement.settlement;


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
                            this.$Message.success("结算成功");
                            this.doWhat("settlementList");
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
        }
    },
    mounted () {
    },
    activated (){
        this.doWhat("list");   
    }
};
</script>