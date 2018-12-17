<!--退款列表-->
<style>
    .search-box {
        height: auto;
        text-align: left;
    }
</style>
<template>
    <Card>

        <div class="doBox">


            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                    <FormItem prop="order_no">
                        <Input type="text" v-model="searchData.order_no" placeholder="输入订单编号搜索" style="width: 250px">
                        <!--<Icon type="ios-eye" slot="prepend" style="width: 30px"></Icon>-->
                        </Input>
                    </FormItem>
                    <FormItem prop="merchant_name">
                        <Input type="text" v-model="searchData.merchant_name" placeholder="输入商家名称搜索" style="width: 250px">
                        <!--<Icon type="ios-eye" slot="prepend" style="width: 30px"></Icon>-->
                        </Input>
                    </FormItem>
                    <FormItem prop="product_name">
                        <Input type="text" v-model="searchData.product_name" placeholder="输入商品名称搜索" style="width: 250px">
                        <!--<Icon type="ios-eye" slot="prepend" style="width: 30px"></Icon>-->
                        </Input>
                    </FormItem>
                    <FormItem prop="member_name">
                        <Input type="text" v-model="searchData.member_name" placeholder="输入会员名称搜索" style="width: 250px">
                        <!--<Icon type="ios-eye" slot="prepend" style="width: 30px"></Icon>-->
                        </Input>
                    </FormItem>

                    <FormItem prop="searchDate">
                        <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
                    </FormItem>
                    <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择订单状态">
                        <Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>
                    </Select>

                    <FormItem>
                        <ButtonGroup>
                            <Button type="primary" icon="search" @click="search()">搜索</Button>
                            <Button @click="resetSearch()">清空</Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </div>
            <Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>
            <div class="page-box">
                <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
            </div>
        </div>


    </Card>
</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    export default {
        name: 'OnlineReturnLists',
        data(){
            return{
                columns: [
                    {
                        title: '订单编号',
                        // width: "10%",
                        key: 'order_no'
                    },
                    {
                        title: ' 商家名称 ',
                        key: 'merchant_name'
                    },
                    {
                        title: '用户名称',
                        width:100,
                        key: 'member_name'
                    },
                    {
                        title: '联系电话',
                        width:130,
                        key: 'mobile'
                    },
                    {
                        title: '商品名称',

                        key: 'product_name'
                    },
                    {
                        title: ' 数量 ',
                        key: 'quantity'
                    },
                    {
                        title: ' 退货原因 ',
                        key: 'return_reason',
                        render: (h, params) => {

                            let tagText="";
                            if(params.row.return_reason==1){
                                tagText="商品破损、损坏";
                            };
                            if(params.row.return_reason==2){
                               tagText="商品质量问题";
                            };
                            if(params.row.return_reason==3){
                                tagText="商品错发、漏发 ";
                            };
                            if(params.row.return_reason==4){
                                tagText="收到商品与描述不符";
                            };
                            if(params.row.return_reason==5){
                                tagText="其他";
                            };
                            return h('span', {
                                props: {
                                    // color: tagcolor,
                                    // size: 'small'
                                }
                            }, tagText);

                        }
                        // 退货原因 1商品破损、损坏，2商品质量问题，3商品错发、漏发 4收到商品与描述不符 5其他
                        // return_action int 退货操作 1申请2同意3驳回
                        // return_status int 退货状态 1申请2同意3驳回

                    },
                    {
                        title: '退货操作',
                        key: 'return_action',
                        render: (h, params) => {

                            let tagText="";
                            if(params.row.return_action==1){
                                tagText="已申请";
                            };
                            if(params.row.return_action==2){
                                tagText="已同意";
                            };
                            if(params.row.return_action==3){
                                tagText="已驳回 ";
                            };

                            return h('span', {
                                props: {
                                    // color: tagcolor,
                                    // size: 'small'
                                }
                            }, tagText);

                        }
                    },
                    {
                        title: ' 退货状态 ',
                        key: 'return_status',
                        render: (h, params) => {

                            let tagText="";
                            if(params.row.return_status==1){
                                tagText="已申请退货";
                            };
                            if(params.row.return_status==2){
                                tagText="已同意退货";
                            };
                            if(params.row.return_status==3){
                                tagText="已驳回退货";
                            };

                            return h('span', {
                                props: {
                                    // color: tagcolor,
                                    // size: 'small'
                                }
                            }, tagText);

                        }
                    },
                    {
                        title: ' 备注 ',
                        key: 'comment'
                    },
                    {
                        title: '新增时间',
                        width:150,
                        key: 'date_added'
                    },
                    {
                        title: '变更时间',
                        width:150,
                        key: 'date_modified'
                    },
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
                    order_no:'',
                    merchant_name :'',
                    product_name:'',
                    member_name:'',

                    searchDate:[],
                    startDate:"",
                    endDate:""
                },
                shipStatus:['申请','同意','驳回'],
                searchValidata: {}
            };
        },
        methods: {
            doWhat(){
                this.init();
            },
            // changePage (pageNumber){
            //     this.page.pageNumber=pageNumber;
            //     this.search();
            // },
            // changePageSize (pageSize){
            //     this.page.pageSize=pageSize;
            //     this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            //     this.search();
            // },

            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                }
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.init();
            },
            init () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.order_no!="")postData.order_no=this.searchData.order_no;
                if(this.searchData.merchant_name!="")postData.merchant_name=this.searchData.merchant_name;
                if(this.searchData.product_name!="")postData.product_name=this.searchData.product_name;
                if(this.searchData.member_name!="")postData.member_name=this.searchData.member_name;
                if(this.searchData.shipStatus>=0)postData.status=this.searchData.shipStatus+1;
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.management.OnlineReturnLists.list,
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
                                // this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                for(var i=0;i<data.data.list.length;i++){
                                    data.data.list[i].comment=decodeURI(data.data.list[i].comment);
                                }
                                this.tableData=data.data.list;
                            }else{
                                this.$Message.error(data.message);
                                if(data.code==Config.errorCode.runOut.num){
                                    this.$store.commit('logout',this);
                                }
                            }
                        }else{
                            this.$Message.error("获取退款列表失败 "+status);
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.$Message.error("获取退款列表失败 "+status);
                    });
            }
        },
        mounted () {
            this.doWhat();
        },
        activated (){
            // this.doWhat();
        }
    };
</script>
