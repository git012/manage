<style>
</style>

<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list">
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                    <Date-picker type="daterange" v-model="searchData.searchDate" placeholder="选择时间范围" style="width: 200px"></Date-picker>
                    <FormItem>
                        <ButtonGroup>
                            <Button type="primary" icon="search" @click="search()">搜索</Button>
                            <Button @click="resetSearch">清空</Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </div>
            <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
            <div class="page-box">
                <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
            </div>
        </div>
    </div>
</template>

<script>
import Config from '../../../config/config';
import Util from '../../../libs/util';
import Cookies from 'js-cookie';


export default {
    name: 'shareBonus',
    props: ["param","publicData"],
    data () {
        return {
            columns: [
                {
                    title: 'ID',
                    // width: "60",
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '商户订单ID',
                    key: 'merchant_order_id',
                },
                {
                    title: '分润积分总金额/转出积分金额',
                    align: 'right',
                    key: 'total_score'
                },
                {
                    title: '代理商公司分润积分金额',
                    align: 'right',
                    key: 'agent_score'
                },
                {
                    title: '代理商公司股东分润积分金额',
                    align: 'right',
                    key: 'member_score'
                },
                {
                    title: 'BD会员分润积分金额',
                    align: 'right',
                    key: 'bd_member_score'
                },
                {
                    title: '服务费',
                    align: 'right',
                    // width: "80",
                    key: 'service_charge'
                },
                {
                    title: '时间',
                    // width: "150",
                    align: 'center',
                    key: 'date_added'
                },
                {
                    title: '状态',
                    key: 'status',
                    // width: "80",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.publicData.shareBonusStatus[params.row.status]);
                    }
                }
            ],
            saveType: "new",
            recordType:["不限类型","代理分红","股份分红","流水"],
            recordStatus:["不限类型","转出","转入"],
            recordKind:["正常","转出预存账户服务费","购买购物积分","BD分红","转出"],
            doType:"shareBonusList",
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
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                kind:"",
                type:""
            },
            searchValidata: {}
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            // return true;
            return !!this.$store.state.Rights[Config.api.agents.agents_settlement[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            if(dotype==this.doType){
                this.dataReady++;
                this.init();
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
                searchDate:[],
                startDate:"",
                endDate:"",
                type:"",
                kind:""
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
            this.doWhat(this.doType);
        },
        init () {
            this.getList();
        },
        getList () {

            let postData={
                ssid:Cookies.get('ssid'),
                agent_id:this.param.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };

            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            
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
            
        }
    },
    mounted () {
    },
    created (){
        this.doWhat(this.doType);   
    }
};
</script>