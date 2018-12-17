<style lang="less">
    @import './area.less';
    .page-box{padding-top: 16px; text-align: center }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                区域管理
            </p>
            <div class="ordler-list">
                <div class="search-box">
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.keyword" placeholder="搜索订单号或者用户名">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" @click="search">搜索</Button>
                        </FormItem>
                    </Form>
                </div>
                <Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                <div class="page-box">
                <Page v-if="page.pageCount>1" :total="page.dataCount" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
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
    name: 'system-area',
    data () {
        return {
            columns: [
                {
                    title: '订单编号',
                    key: 'order_no'
                },
                {
                    title: '用户名',
                    // width: "10%",
                    key: 'member_name'
                },
                {
                    title: '时间',
                    "sortable": true,
                    // width: "15%",
                    key: 'date_added'
                },
                {
                    title: '购物指数',
                    "sortable": true,
                    // width: "12%",
                    key: 'username'
                },
                {
                    title: '可提现金额',
                    "sortable": true,
                    // width: "12%",
                    key: 'cash'
                },
                {
                    title: '白积分',
                    "sortable": true,
                    // width: "12%",
                    key: 'score'
                },
                {
                    title: '总金额',
                    "sortable": true,
                    // width: "12%",
                    key: 'total_score'
                },
                {
                    title: '状态',
                    "sortable": true,
                    key: 'status',
                    // width: "8%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="交易中";
                        if(params.row.status==1){
                            tagcolor="green";tagText="待支付";
                        };
                        if(params.row.status==2){
                            tagcolor="red";tagText="已支付";
                        };
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);
                    }
                }
            ],
            saveType: "new",
            tableData: [],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            
            currentData: {
                "id":0,
                "order_no":"",
                "merchant_id":0,
                "member_name":"",
                "total_score":1,
                "status":1,
                "date_added":"",
                "cash":0,
                "score":0
            },
            getLoading: false,
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {}
        };
    },
    methods: {
        showEdit (index) {
            this.currentData = $.extend(true, {}, this.tableData[index]);
            this.currentData.dataIndex=index;
            this.saveType="edit";
            this.editModal = true;
        },
        cancelEdit () {
            this.editModal = false;
        },
        changePage (pageNumber){
            this.page.pageNumber=pageNumber;
            this.search();
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        search () {
            console.log(JSON.stringify(this.searchData));
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            }
            this.init();
        },
        init () {
            //订单列表
            // startDate
            // endDate
            // search
            // page
            // pageSize

            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.search=this.searchData.keyword;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.order.getList,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        this.page.dataCount=data.data.count;
                        this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                        this.tableData=data.data.list;
                    }else{
                        this.$Message.error(data.message);
                        if(data.code==Config.errorCode.runOut.num){
                            this.$store.commit('logout',this);
                        }
                    }
                }else{
                   this.$Message.error("获取订单卡列表失败 "+status); 
                }
            })
            .fail((xhr,status,error)=>{
                this.$Message.error("获取订单卡列表失败 "+status);
            });
        }
    },
    mounted () {
        //this.init();
    }
};
</script>
