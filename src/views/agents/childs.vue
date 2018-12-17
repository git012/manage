<style lang="less">
    @import './agents.less';
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
        <div class="search-box">
            <Button type="success"  
                v-if="checkPower('manageChild')" 
                @click="doWhat('add')" >添加股东
            </Button>
        </div>
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
    name: 'childs',
    data () {
        return {
            isViewImage:false,
            viewImageUrl:"",
            columns: [
                {
                    title: '股东帐号',
                    align: 'center',
                    // width: "15%",
                    key: 'member_name'
                },
                {
                    title: '股东类型',
                    key: 'type',
                    // width: "15%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.publicData.shareholderType[params.row.type]);
                    }
                },
                {
                    title: '推荐人',
                    align: 'center',
                    // width: "15%",
                    key: 'share_member_name'
                },
                {
                    title: '分润比例',
                    align: 'right',
                    // width: "15%",
                    key: 'share_ratio'
                },
                {
                    title: '股权金额',
                    align: 'right',
                    // width: "20%",
                    key: 'agent_stock_amount'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        let editButton=h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("cardList",params.index)
                                    }
                                }
                            }, '卡列表');
                        let manageChildButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("giveChildCard",params.index)
                                    }
                                }
                            }, '发卡');
                        let dobutton=[];
       
                        if(this.checkPower("cardList")){
                           dobutton.push(editButton);
                        };
                        if(this.checkPower("giveChildCard")){
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
            return !!this.$store.state.Rights[Config.api.agents.agents_list[dotype]];
        },
        doWhat (dotype,dataIndex) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            };
            if(dotype=="edit"){
                this.paramData.shareholder=this.tableData[dataIndex];
                this.$emit("doWhat","editChild",this.paramData);
            };
            if(dotype=="add"){
                this.paramData.shareholder={};
                this.$emit("doWhat","addChild",this.paramData);
            };
            if(dotype=="manageChild"){
                this.$emit("doWhat","manageChild",this.paramData);
            };
            if(dotype=="giveChildCard"){
                this.paramData.shareholder=this.tableData[dataIndex];
                this.$emit("doWhat","giveChildCard",this.paramData);
            };
            if(dotype=="cardList"){
                this.paramData.shareholder=this.tableData[dataIndex];
                this.$emit("doWhat","cardList",this.paramData);
            };
            if(dotype=="view"){
                this.detailData=this.tableData[dataIndex];
                this.viewDataReady=true;
                this.viewDetail=true;
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
                agent_id:this.param.agent.id,
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.search=this.searchData.keyword;
            if(this.searchData.type!="")postData.type=this.searchData.type;
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_list.manageChild,
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
                url: Config.apiRootPath+Config.api.agents.agents_list.delete,
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
        // if(localStorage.pageInfro){
        //     this.page=JSON.parse(localStorage.pageInfro);
        // };
        // if(localStorage.seachInfro){
        //     this.searchData=JSON.parse(localStorage.seachInfro);
        // };
        this.tableData=[];
        this.doWhat("list");
    }
};
</script>