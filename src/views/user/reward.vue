<style lang="less">
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="archive"></Icon>
                {{doName}}
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>         
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.search" placeholder="输入用户名称">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
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
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';



export default {
    name: 'user_reward',
    data () {
        return {
            tableOptions:{
                width:"100%"
            },
            kind:{},
            payStatus:["不限","待支付","已支付"],
            shipStatus:["不限","待发货","已发货"],
            columns: [
                {
                    title: 'ID',
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '用户名',
                    key: 'name'
                },
                // {
                //     title: '金额',
                //     key: 'total_score',
                //     align: 'right',
                //     render: (h, params) => {
                //         return h('span', {}, Util.fmoney(Util.numberCarry(params.row.total_score,100,4),6));
                //     }
                // },
                {
                    title: '推荐奖励总数',
                    key: 'recommended_rewards_total',
                    align: 'right',
                    render: (h, params) => {
                        return params.row.recommended_rewards_total;
                        //return h('span', {}, Util.fmoney(Util.numberCarry(params.row.cash,100,4),6));
                    }
                },
                {
                    title: '分享奖励总数',
                    align: 'right',
                    key: 'share_rewards_total'
                },
                {
                    title: '代理推荐奖励总数',
                    align: 'right',
                    key: 'agent_recommended_rewards_total'
                }
            ],
            doType:"list",
            switching:false,
            tableData: [],
            defaultData:{
                "id": 2,
                "order_no": "",
                "merchant_id": 1,
                "merchant_name": "",
                "member_id": 0,
                "member_name": "",
                "total_score": "3.0000",
                "status": 1,
                "date_added": "2017-11-14 15:58:44",
                "cash": "0.0000",
                "score": "0.0000"
            },
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:0,
            searchData:{
                search:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                payStatus:"",
                shipStatus:""
            },
            searchValidata: {}
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        },
        doName () {
            if (this.doType=="list") return "会员奖励统计";
            return "会员奖励统计";
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.user.user_reward[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            this.switching=true;
            if(dotype=="add"){
                this.resetCurrentData();
                this.doType="add";
            };
            if(dotype=="edit"){
                this.showEdit(dataIndex);
                this.doType="edit";
            };
            if(dotype=="delete"){
                this.delete(dataIndex);
            };
            if(dotype=="review"){
                this.changeStatus(dataIndex);
            };
            if(dotype=="list"){
                this.resetCurrentData();
                this.dataReady+=1;
                this.init();
                this.doType="list";
            };
            this.switching=false;
        },
        view (index) {

        },
        showEdit (index) {
            this.currentData=$.extend(true, {}, this.tableData[index]);
            this.doType="edit";
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
                merchantId:"",
                memberId:"",
                searchDate:[],
                startDate:"",
                endDate:""
            };
            this.page.pageNumber=1;
            this.doWhat("list");
        },
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            }
            this.page.pageNumber=1;
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.doWhat("list");
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
            if(this.searchData.search!="")postData.name=this.searchData.search;
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_reward.list,
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
        //delete
        delete (index) {
            if(!this.tableData[index].id)return;
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id,
                    status:0
                });
            $.ajax({
                url: Config.apiRootPath+Config.api.news.news_list.delete,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("删除成功!"); 
                        this.tableData.splice(index, 1);
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
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        }
    },
    updated () {
    },
    mounted () {
    },
    deactivated () {
    },
    activated (){
        this.doWhat("list");   
    }
};
</script>