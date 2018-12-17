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
</style>

<template>
    <div class="ordler-list">
        <div class="search-box">
            <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                <FormItem prop="keyword">
                    <Input type="text" v-model="searchData.keyword" placeholder="输入代理商名称搜索">
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
        <Modal v-model="viewDetail" :closable='false' :mask-closable=false :width="600">
            <Spin size="large" fix v-if="!viewDataReady"></Spin>
            <h3 slot="header" style="color:#2D8CF0">代理商详情 [{{detailData.id}}] </h3>
            <table class="item-list">
                <tr><td class="item-title">代理商账户名称</td><td class="item-content">{{detailData.agent_name}}</td></tr>
                <tr><td class="item-title">公司名称</td><td class="item-content">{{detailData.enterprise_name}}</td></tr>
                <tr><td class="item-title">代理商类型</td><td class="item-content">{{publicData.agentsTypeData[detailData.type]}}</td></tr>
                <tr><td class="item-title">地址</td><td class="item-content">{{detailData.province_name}}{{detailData.city_name}}{{detailData.district_name}}</td></tr>
                <tr><td class="item-title">代理商电话</td><td class="item-content">{{detailData.tel}}</td></tr>
                <tr><td class="item-title">法人</td><td class="item-content">{{detailData.juridical_person}}</td></tr>
                <tr><td class="item-title">法人身份证</td><td class="item-content">
                    <a v-if="detailData.juridical_person_card!=''" href="javascript:;" @click="viewImage(detailData.juridical_person_card)">点击查看</a>
                </td></tr>
                <tr><td class="item-title">法人身份证照片</td><td class="item-content">
                    <a v-if="detailData.juridical_person_card_image!=''" href="javascript:;" @click="viewImage(detailData.juridical_person_card_image)">点击查看</a>
                </td></tr>
                <tr><td class="item-title">营业执照</td><td class="item-content">
                    <a v-if="detailData.business_licence_image!=''" href="javascript:;" @click="viewImage(detailData.business_licence_image)">点击查看</a>
                </td></tr>
                <tr><td class="item-title">创建时间</td><td class="item-content">{{detailData.date_added}}</td></tr>
                <tr><td class="item-title">股东分润比例</td><td class="item-content">{{detailData.share_member_ratio}}</td></tr>
                <tr><td class="item-title">公司分润比例</td><td class="item-content">{{detailData.share_company_ratio}}</td></tr>
                <tr><td class="item-title">BD会员分润比例</td><td class="item-content">{{detailData.share_bd_ratio}}</td></tr>
            </table>
            <div slot="footer">
                <Button type="primary" @click="closeView">关闭</Button>
            </div>
        </Modal>
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
    name: 'agents-list',
    data () {
        return {
            isViewImage:false,
            viewImageUrl:"",
            columns: [
                {
                    title: 'ID',
                    // width: "60",
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '代理公司名称',
                    // width: "160",
                    key: 'enterprise_name'
                },
                {
                    title: '代理商名称',
                    key: 'agent_name'
                },
                {
                    title: '代理商电话',
                    // width: "120",
                    key: 'tel'
                },
                {
                    title: '地区',
                    key: 'province_id',
                    render: (h, params) => {
                        
                        let tagText=params.row.province_name;
                        if(params.row.city_name)tagText+=params.row.city_name;
                        if(params.row.district_name)tagText+=params.row.district_name;
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '创建时间',
                    // width: "130",
                    align: 'center',
                    key: 'date_added'
                },
                {
                    title: '代理商类型',
                    key: 'type',
                    // width: "88",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.publicData.agentsTypeData[params.row.type]);
                    }
                },
                {
                    title: '余额',
                    align: 'right',
                    key: 'agent_score'
                },
                 {
                    title: '购物积分',
                    align: 'right',
                    key: 'shopping_score'
                },
                {
                    title: '白积分',
                    align: 'right',
                    key: 'white_score'
                },
                {
                    title: '红分红',
                    align: 'right',
                    key: 'red_score'
                },
                {
                    title: '账户锁定',
                    key: 'is_lock',
                    width:100,
                    render: (h, params) => {
                        let tagText="";
                        if(params.row.is_lock==0){
                           tagText="正常";
                        };
                        if(params.row.is_lock==1){
                           tagText="锁定";
                        };
                        return h('span', {
                            props: {
                                size: 'small'
                            }
                        }, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        let viewButton=h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("view",params.index)
                                    }
                                }
                            }, '详情');
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
                                        this.doWhat("edit",params.index)
                                    }
                                }
                            }, '编辑');
                        let shareScaleButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("shareScale",params.index)
                                    }
                                }
                            }, '分红比例');
                        let manageChildButton=h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("manageChild",params.index)
                                    }
                                }
                            }, '股东管理');
                        let dobutton=[];
                        if(this.checkPower("view")){
                           //  dobutton.push(viewButton);
                        };
                        if(this.checkPower("edit")){
                            dobutton.push(editButton);
                        };
                        if(this.checkPower("shareScale")){
                            dobutton.push(shareScaleButton);
                         };
                        if(this.checkPower("manageChild")){
                            dobutton.push(manageChildButton);
                        };
                        
                        
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
       
            if(dataIndex>=0){
                this.paramData.agent=this.tableData[dataIndex];
            };
       
            if(dotype=="edit"){
        
                this.$emit("doWhat","edit",this.paramData);
            };
            if(dotype=="manageChild"){
                this.$emit("doWhat","manageChild",this.paramData);
            };
            if(dotype=="shareScale"){
                this.$emit("doWhat","shareScale",this.paramData);
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
            this.search(pageNumber);
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        //list
        search (pageNumber) {
            if(this.searchData.keyword){
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
            this.dataReady=1;
            this.init();
        },
        init () {
            this.getList();
        },
        getList () {
           // return;
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.user_name=this.searchData.keyword;

            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_list.list,
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
        localStorage.pageInfro=JSON.stringify(this.page);
        localStorage.seachInfro=JSON.stringify(this.searchData);
    },
    mounted () {
    },
    created () {
        this.paramData=this.param;
        if(localStorage.pageInfro){
            this.page=JSON.parse(localStorage.pageInfro);
        };
        if(localStorage.seachInfro){
            this.searchData=JSON.parse(localStorage.seachInfro);

        };
        this.tableData=[];
        this.doWhat("list");
    }
};
</script>