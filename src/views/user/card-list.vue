<style lang="less">
    @import './card-list.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .search-box{ height:42px; text-align:left}
</style>

<template>
    <div class="ordler-list">
        <Row>
            <Col span="12">
                <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                    <FormItem prop="keyword">
                        <Input type="text" v-model="searchData.keyword" placeholder="输入卡号查询">
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
            </Col>
            <Col span="12" style="text-align:right">
                <Button type="error" @click="$emit('doWhat','manageChild',param)">返回股东列表</Button>
            </Col>
        </Row>
        
        <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
        <div class="page-box">
            <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
      
        </div>
        <Modal v-model="isViewImage" :closable='false' :mask-closable=false :width="800">
            <img :src="viewImageUrl" width="100%" height="auto" />
            <div slot="footer">
                <Button type="primary" @click="isViewImage=false">关闭</Button>
            </div>
        </Modal>
    </div>        
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';

export default {
    name: 'cardList',
    data () {
        return {
            isViewImage:false,
            viewImageUrl:"",
            columns: [
                {
                    title: '卡号',
                    align: 'center',
                    key: 'card_no'
                },
                {
                    title: '类型',
                    align: 'center',
                    key: 'amount',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="事业合伙人卡";
                        
                        if(params.row.amount==999){
                            tagText="分享合伙人卡";
                        };
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '价格',
                    align: 'center',
                    key: 'amount'
                },
                {
                    title: '状态',
                    align: 'center',
                    width:150,
                    key: 'is_used',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="未使用";
                        if(params.row.is_used==1){
                            let tagText="使用";
                            return h('Tag', {
                                props: {
                                    color: "green",
                                    size: 'small'
                                }
                            }, tagText);
                        };
                        return h('span', {}, tagText);

                    }
                },
                {
                    title: '使用人名称',
                    align: 'center',
                    width:150,
                    key: 'name',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="----";
                        if(!!params.row.name){
                            tagText=params.row.name;
                        };
                        return h('span', {}, tagText);

                    }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    width:150,
                    key: 'date_added'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width:80,
                    render: (h, params) => {
                        let manageChildButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("unBindChildCard",params.index)
                                    }
                                }
                            }, '解绑');
                        let dobutton=[];
                        if(this.checkPower("unBindChildCard")){
                            dobutton.push(manageChildButton);
                        };
                        // if(this.checkPower("hidden")){
                        //     dobutton.push(deleteButton);
                        // };
                        
                        return h('div', dobutton);
                    }
                }
            ],
            doType:"list",
            dataReady:0,
            tableData: [],
            viewDataReady:false,
            viewDetail:false,
            detailData:{},
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:""
            },
            searchValidata: {},
            paramData:{}
        };
    },
    props: ["param","publicData"],
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return true;
            return !!this.$store.state.Rights[Config.api.agents.agents_list[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            };
            if(dotype=="manageChild"){
                this.$emit("doWhat","manageChild",this.paramData);
            };
            if(dotype=="unBindChildCard"){
                this.unBindChildCard(dataIndex);
            };
            if(dotype=="list"){
                this.dataReady=1;
                this.init();
            };
        },
        closeView () {
            this.detailData={};
            this.viewDataReady=false;
            this.viewDetail=false;
        },
        viewImage (imgUrl) {
            if(!imgUrl)return;
            this.viewImageUrl=imgUrl;
            this.isViewImage=true;
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
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };
            this.page.pageNumber=1;
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.doWhat("list");
        },
        resetSearch () {
            this.searchData={
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:0
            };
            this.page.pageNumber=1;
            this.dataReady++;
            this.init();
        },
        init () {
            this.getList();
        },
        getList () {
            let postData={
                ssid:Cookies.get('ssid'),
                member_id:this.param.shareholder.member_id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.card_no=Util.trim(this.searchData.keyword);

            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_list.cardList,
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
        unBindChildCard (index) {

            if(!this.tableData[index].id)return;
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id,
                });
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_list.unBindChildCard,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("解绑成功!");
                        this.resetSearch();
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
    destroyed () {
    },
    mounted () {
    },
    created () {
        this.paramData=this.param;
        if(this.param&&this.param.agent&&this.param.agent.id){
        }else{
            this.$emit("doWhat","list",this.param);
            return;
        }
        this.tableData=[];
        this.doWhat("list");
    }
};
</script>