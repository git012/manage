<style>
</style>
<!-- 代理商红积分明细 -->
<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list">
            <Row>
                <Col span="11">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Select v-model="searchData.kind" style="width:140px" placeholder="选择种类">
                                <!-- <Option value="-1" key="-1">不限种类</Option> -->
                                <Option v-for="item,key in recordKind" :value="key" :key="key">{{ item }}</Option>
                            </Select>
                            <Select v-model="searchData.status" style="width:90px" placeholder="选择类型">
                                <Option v-for="item,key in recordStatus" :value="key" :key="key">{{ item }}</Option>
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
                <Col span="13">
                    <div class="buttonGroup">
                        <Button type="error">红积分</Button>
                        <Button type="primary" @click="$emit('doWhat','userBuyIntegralList')">购物积分</Button>
                        <Button type="primary" @click="$emit('doWhat','userReturnIntegralList')">白积分</Button>
                        
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
    name: 'ConsumeBonuses',
    props: ["param","publicData"],
    data () {
        return {
            columns: [


//             agent_id    int     代理ID
// destination_id  int     目标ID（转账对方ID)
// amount  float   金额
// created     date    创建时间
// kind    int     种类 1-白积分释放（转入），2-转代理自己购物积分（转出），3-转会员购物积分（转出），4-直营店消费（转出）
// status  int     状态（1-转出2-转入）
// agent_name  string  代理名称
// destination_name    string  目标名称
                {
                    title: '代理ID',
                    align: 'center',
                    key: 'agent_id'
                },
                {
                    title: '转账对方ID',
                    align: 'center',
                    key: 'destination_id'
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'amount'
                },
                {
                    title: '代理名称',
                    align: 'center',
                    key: 'agent_name'
                },
                {
                    title: '目标名称',
                    key: 'destination_name',
                    align: 'right'
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 80,
                    key: 'status',
                    render: (h, params) => {

                        return h('span', {}, this.recordStatus[params.row.status]);
                    }
                },
                {
                    title: '积分种类',
                    width: 130,
                    align: 'center',
                    key: 'kind',
                    render: (h, params) => {

                        return h('span', {}, this.recordKind[params.row.kind]);
                    }
                }
            ],
            saveType: "new",
            recordStatus:["不限类型","转出","转入"],
            recordKind:["----","白积分释放（转入）","转代理自己购物积分（转出）","转会员购物积分（转出）","直营店消费（转出）","会员升级","其他"],


            // 代理红积分种类 1-白积分释放（转入），2-转代理自己购物积分（转出），3-转会员购物积分（转出），4-直营店消费（转出） ，5-会员升级
            doType:"userConsumeBonusesList",
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
                status:""
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
            return !!this.$store.state.Rights[Config.api.agents.agents_settlements[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {
            // if(!this.checkPower(dotype)){
            //     this.$Message.warning("对不起，您没有此操作权限！");
            //     return;
            // }
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
                status:"",
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
                name:this.param.agent_name,
                id:this.param.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.status!==""&&this.searchData.status>=0)postData.status=this.searchData.status;
            if(this.searchData.kind!==""&&this.searchData.kind>=0)postData.kind=this.searchData.kind;
            if(this.searchData.startDate!=="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!=="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_settlements[this.doType],
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
