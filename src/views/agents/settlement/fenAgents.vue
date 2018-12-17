<style>
</style>
<!-- 购物积分 -->
<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list">
            <Row>
                <!--<Col span="11">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        	<FormItem prop="keyword" style="margin-bottom:0px">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入代理ID搜索">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Select v-model="searchData.kind" style="width:120px" placeholder="选择分红状态">
                                <Option v-for="item in recordStatus" :value="item.value">{{ item.name }}</Option>
                            </Select>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                </Col>-->
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
    name: 'meblist',
    props: ["param","publicData"],
    data () {
        return {
            columns: [
                {
                    title: '代理ID',
                    align: 'center',
                    key: 'agent_id'
                },
                {
                    title: '分红状态',
                    align: 'center',
                    key: 'is_bonus',
                },
               
                {
                    title: '百分之三十白积分存库',
                    align: 'center',
                    key: 'deposit'
                },
                {
                    title: '百分之七十白积分分发',
                    align: 'center',
                    key: 'distribution'
                },
                {
                    title: '总白积分',
                    align: 'center',
                    key: 'total'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'created'
                },
                {
                    title: '分发时间',
                    align: 'center',
                    key: 'update_time'
                },
                {
                    title: '分发结余',
                    align: 'center',
                    key: 'surplus'
                },
                {
                    title: '分红状态',
                    align: 'center',
                    key: 'is_bonus',
                    render: (h, params) => {
                        let tagText="";
                        if(params.row.is_bonus==0){
                           tagText="未分红";
                        };
                        if(params.row.is_bonus==1){
                           tagText="已分红";
                        };
                        return h('span', {
                            props: {
                                size: 'small',
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
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("sharebonusButton",params.index)
                                    }
                                }
                            }, '分红');
                        let dobutton=[];
                        if(
                            this.checkPower("sharebonusButton")
                        ){
                            dobutton.push(viewButton);
                        };
                        return h('div', dobutton);
                    }
                }            ],
            saveType: "new",
            recordKind:["不限类型","消费券返还","转红积分账户","转购物积分","白积分释放","白积分释放","其他"],
                // 种类 1-消费券返还,2-转红积分账户，3-转购物积分，4-白积分释放，5-直营店消费 6-其他
            recordStatus:[{"value":0,"name":"未分红"},{"value":1,"name":"已分红"}],
            doType:"usermeb_list",
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
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            if(dotype=="usermeb_list"){
                this.dataReady++;
                this.init();
            };
            if(dotype=="sharebonusButton"){
                this.dataReady++;
                this.sharebonusButton();
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
                name:this.param.agent_name,
                agentId:this.param.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!=="")postData.agentId=this.searchData.keyword;
            if(this.searchData.kind!==""&&this.searchData.kind>=0)postData.is_bonus=this.searchData.kind;
            if(this.searchData.startDate!=="")postData.starttime=this.searchData.startDate;
            if(this.searchData.endDate!=="")postData.endtime=this.searchData.endDate;
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
        sharebonusButton (){
        	console.log(this.param);
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_settlements.sharebonusButton,
                type: 'POST',
                dataType: 'json',
                data: {
                	id:this.param.id,
                	ssid:Cookies.get('ssid')
                }
            })
            .done((data)=>{
            	console.log(data);
                this.dataReady--;    
                // getList
                if(!!data){
                    if(data.code==0){ 
                        this.getList();
                        //format list data
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