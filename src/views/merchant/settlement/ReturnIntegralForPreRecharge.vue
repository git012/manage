<style>
</style>

<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list">
            <Row>
                <Col span="10">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Select v-model="searchData.kind" style="width:140px" placeholder="选择种类">
                                <Option value="-1" key="-1">不限种类</Option>
                                <Option v-for="item,key in recordKind" :value="key" :key="key">{{ item }}</Option>
                            </Select>
                            <Select v-model="searchData.type" style="width:90px" placeholder="选择类型">
                                <Option v-for="item,key in recordType" :value="key" :key="key">{{ item }}</Option>
                            </Select>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
                <Col span="14">
                    <div class="buttonGroup">
                        <Button type="primary" @click="$emit('doWhat','userConsumeBonusesForPreRechargeList')">消费增值积分</Button>
                        <Button type="primary" @click="$emit('doWhat','userBuyIntegralForPreRechargeList')">购物积分</Button>
                        <Button type="error">全返积分</Button>
                    </div>
                </Col>
            </Row>
            <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
            <div class="page-box">
                <Page v-if="page.dataCount>10" :total="page.dataCount" show-total :current="page.pageNumber" :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
            </div>
        </div>
    </div>
</template>

<script>
import Config from '../../../config/config';
import Util from '../../../libs/util';
import Cookies from 'js-cookie';


export default {
    name: 'ReturnIntegralForPreRecharge',
    props: ["param","publicData","preRechargeData"],
    data () {
        return {
            columns: [
                {
                    title: 'ID',
                    width: 60,
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '用户名',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '已返金额',
                    key: 'share_yes',
                    align: 'right'
                },
                {
                    title: '未返金额',
                    align: 'right',
                    key: 'share_no'
                },
                {
                    title: '本次返还金额',
                    align: 'right',
                    key: 'share'
                },
                {
                    title: '类型',
                    align: 'center',
                    key: 'stauts',
                    render: (h, params) => {

                        return h('span', {}, this.recordType[params.row.status]);
                    }
                },
                {
                    title: '种类',
                    width: 130,
                    align: 'center',
                    key: 'kind',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.recordKind[params.row.kind]);
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 80,
                    key: 're_status'
                },
                {
                    title: '创建时间',
                    width: 130,
                    align: 'center',
                    key: 'created'
                }
            ],
            saveType: "new",
            recordType:["不限类型","转出","转入"],
            recordKind:["正常","分发积分","升级奖励积分"],
            doType:"userReturnIntegralList",
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
            return !!this.$store.state.Rights[Config.api.user.user_settlement[dotype].MD5()];
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
                name:this.param.name,
                rid:this.preRechargeData.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.type!==""&&this.searchData.type>=0)postData.status=this.searchData.type;
            if(this.searchData.kind!==""&&this.searchData.kind>=0)postData.kind=this.searchData.kind;
            if(this.searchData.startDate!=="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!=="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_settlement[this.doType],
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
    },
    mounted () {
    },
    created (){
        this.doWhat(this.doType);
    }
};
</script>
