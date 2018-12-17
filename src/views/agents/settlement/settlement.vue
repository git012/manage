<style>
</style>

<template>
    <div class="doBox">
        <Spin size="large" fix v-if="switching"></Spin>
        <div class="ordler-list">
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                    <Date-picker type="month" v-model="searchData.searchDate" placeholder="选择未结算月份" style="width: 200px"></Date-picker>
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
    name: 'settlement',
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
                    title: '代理名称',
                    key: 'agent_name'
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
                    title: '年',
                    align: 'center',
                    key: 'years'
                },
                {
                    title: '月',
                    align: 'center',
                    key: 'months'
                },
                {
                    title: '分润积分总额',
                    align: 'right',
                    key: 'agent_score'
                },
                {
                    title: '结算状态',
                    key: 'status',
                    // width: "80",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.publicData.settlementStatusData[params.row.status]);
                    }
                },
                {
                    title: '结算时间',
                    align: 'center',
                    // width: "150",
                    key: 'date_added',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="--";
                        if(params.row.date_added){tagText=params.row.date_added};
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {

                        let settlementButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("settlement",params.index)
                                    }
                                }
                            }, '结算');

                        let dobutton=[];
                        if(params.row.status==1){
                            if(this.checkPower("settlement")){
                                dobutton.push(settlementButton);
                            };
                        }
                        return h('div', dobutton);
                    }
                }
            ],
            doType:"settlementList",
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
            
            if(this.searchData.searchDate!="")postData.years=this.searchData.searchDate.getFullYear();
            if(this.searchData.searchDate!="")postData.months=this.searchData.searchDate.getMonth();

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
    created (){
        this.doWhat(this.doType);   
    }
};
</script>