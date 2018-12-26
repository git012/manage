<style>
</style>
<!-- 商户营业额明细入账 -->
<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list" v-if="this.doType == 'turnoverListGet'">
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
                        <Button type="primary" @click="$emit('doWhat','userConsumeBonusesList')">红积分</Button>
                        <Button type="primary" @click="$emit('doWhat','userBuyIntegralList')">购物积分</Button>
                        <Button type="primary" @click="$emit('doWhat','userReturnIntegralList')">白积分</Button>
                      	<Button type="error">营业额</Button>
                    </div>
                </Col>
                <Col span="14" style="margin: 10px 0px;">
                    <div class="buttonGroup">
                      	<Button type="warning"  @click="$emit('doWhat','turnoverList')" class="add-btu margin-right-10" size="small">查看出账明细</Button>
                    </div>
                </Col>
				<Col span="24" style="margin-bottom: 20px;text-align: center;">
                    <div style="font-weight: bold; font-size: 16px;">营业额  —— 入账明细</div>
                </Col>
            </Row>
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
    name: 'ReturnIntegral',
    props: ["param","publicData"],
    data () {
        return {
            columns: [
                {
                    title: '来源(订单Id)',
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '时间',
                    align: 'center',
                    key: 'date_added'
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'total'
                },
                {
                    title: '类型',
                    align: 'center',
                    render: (h, params) => {

                        return h('span','转入');
                    }
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'name',
                },
                {
                    title: '积分种类',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="订单";
                        return h('span',tagText);
                    }
                }
            ],
            saveType: "new",
            recordType:["不限类型","转出","转入"],
            recordKind:["----","订单返还（转入）","白积分转红积分万分之五（转出）"],
            // 商户白积分种类 1-订单返还（转入）2-白积分转红积分万分之五（转出）
            doType:"turnoverListGet",
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
            return !!this.$store.state.Rights[Config.api.merchant.merchant_settlement[dotype].MD5()];
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
                name:this.param.merchantName,
                merchantId:this.param.merchantId,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.type!==""&&this.searchData.type>=0)postData.status=this.searchData.type;
            if(this.searchData.kind!==""&&this.searchData.kind>=0)postData.kind=this.searchData.kind;
            if(this.searchData.startDate!=="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!=="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_settlement[this.doType],
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
