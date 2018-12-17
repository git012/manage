<style lang="less">
    @import './merchant.less';
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
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small"
                    v-if="checkPower('list')&&doType!='list'"
                    @click="doWhat('list')" >返回列表
                </Button>
                <!--<Button type="primary" class="add-btu" size="small"
                    v-if="checkPower('add')&&doType=='list'"
                    @click="doWhat('add')" >添加商户
                </Button>-->
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
<!--默认展示列表-->  
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称或者帐号搜索商户">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem>
                            <Select v-model="searchData.type" style="width:150px" placeholder="请选择审核状态">
                                <Option v-for="item in recordStatus" :value="item.value">{{ item.name }}</Option>
                            </Select>
                            </FormItem>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch()">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                    <Table class="small_table" v-if="doType=='list'" border :columns="columns" :data="tableData"></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
            <Modal v-model="updateStatus" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">代理审核</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="180" label-position="right" :rules="currentDataValidate">
                    <FormItem label="股东姓名：">
            			<div style="width:200px;">
                			<Input v-model="updateStatusForm.share_name" readonly="readonly"></Input>
            			</div>
        			</FormItem>
        			<FormItem label="股东电话：">
            			<div style="width:200px;">
                			<Input v-model="updateStatusForm.share_phone" readonly="readonly"></Input>
            			</div>
        			</FormItem>
        			<FormItem label="打款凭证：" style="margin-bottom:0px">
                        <img class="viewImg" @click="viewImage(updateStatusForm.money_certificates)" height="60" :src="updateStatusForm.money_certificates" />
                    </FormItem>
                    <FormItem label="审核状态：" prop="applicantStatus">
                        <RadioGroup v-model="updateStatusForm.applicantStatus">
                            <Radio label="0">
                                <span>未审核</span>
                            </Radio>
                            <Radio label="1">
                                <span>通过</span>
                            </Radio>
                            <Radio label="2">
                                <span>未通过</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelUpdateStatus">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
                </div>
            </Modal>
            <Modal v-model="isShowCurrentImage" :width="600">
                <h3 slot="header" style="color:#2D8CF0">图片预览</h3>
                <div align="center">
                    <img :src="viewCurrentImage" width="100%" />
                </div>
                <div slot="footer">
                    <Button type="primary" @click="closeViewImage">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';


export default {
    name: 'merchant_list',
    data () {
    	const valideShareMemberType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择股东类型1'));
            }
        };
        const valideMerchantType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择商户折扣差'));
            }
        };
        const validRatio = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择白积分商品折扣差'));
            }
        };


        const idcard=(rule, value, callback)=>{
                let re=/(^[0-9]{15}$)|(^[0-9]{17}([0-9Xx])$)/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的身份证'));
            } else {
                callback();
            }

        };
        const validePhone = (rule, value, callback) => {
            var re = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号或者座机'));
            } else {
                callback();
            }
        };
        const valideMerchantBoutiqueSort = (rule, value, callback) => {
            if(value==""){
                if(this.currentData.merchantIsBoutique=="1"){

                    callback(new Error('推荐商户必须填写序号'));

                }else{
                    callback();
                }
            }else{
                callback();
            }

        };


        const valideMerchantBoutiquemerchantIsshop = (rule, value, callback) => {
            if(value==""){
                if(this.currentData.merchantType=="2"){

                    callback(new Error('推荐商户必须填写序号'));

                }else{
                    callback();
                }
            }else{
                callback();
            }

        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.currentData.userPassword) {
                callback(new Error('两次输入登录密码不一致'));
            } else {
                callback();
            }
        };
        const valideCashPassword = (rule, value, callback) => {
            if (value !== this.currentData.merchantPasswd) {
                callback(new Error('两次输入的提现密码不一致'));
            } else {
                callback();
            }
        };
        const valideMerchantProvinceId = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择地区'));
            }
        };
        return {

            columns: [
                {
                    title: 'ID',
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '悟空团账号',
                    key: 'member_name',
                    align: 'center',
                },
                {
                    title:'分润比例',
                    key:'share_ratio',
                    align: 'center',
                },
                {
                    title: '股权金额',
                    // width: "6%",
                    key: 'agent_stock_amount',
                    align: 'center',
                },
                {
                    title: '代理类型',
                    key: 'agent_type',
                    align: 'center',
                    render: (h, params) => {
                        let tagText="";
                        if(params.row.agent_type==1){
                            tagText="全球总代理";
                        };
                        if(params.row.agent_type==2){
                            tagText="省代理";
                        };
                        if(params.row.agent_type==3){
                            tagText="市代理";
                        };
                        if(params.row.agent_type==4){
                            tagText="区县代理";
                        };
                        if(params.row.agent_type==5){
                            tagText="其他";
                        };
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '股东姓名',
                    key: 'share_name',
                    align: 'center',
                },
                {
                    title: '股东电话',
                    align: 'center',
                    // width: "94",
                    key: 'share_phone'
                },
                {
                    title: '申请时间',
                    align: 'center',
                    // width: "94",
                    key: 'date_added'
                },
                {
                    title: '状态',
                    key: 'status',
                    // width: "80",
                    align: 'center',
                    render: (h, params) => {

                        let tagcolor="default";
                        let tagText="审核中";
                        if(params.row.status==1){
                            tagcolor="green";tagText="已通过";
                        };
                        if(params.row.status==2){
                            tagcolor="red";tagText="已拒绝";
                        };
                        return h('span', {}, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        let editButton=h('Button', {
                                props: {
                                    type: 'primary',
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
                            }, '详情');
                        let deleteButton=h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.index)
                                    }
                                }
                            }, '审核');
                        let dobutton=[];
//                      if(this.checkPower("edit")){
//                          dobutton.push(editButton);
//                      };
                        if(this.checkPower("review")){
                            dobutton.push(deleteButton);
                        };

                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            doType:"list",
            switching:false,
            showTypeOn:false,
            showTypeOff:false,
            tableData: [],
            merchantTypeData: [],
            zkData:[{'value':'0.06','name':'6%'},{'value':'0.1','name':'10%'},{'value':'0.15','name':'15%'},{'value':'0.2','name':'20%'}],
            zkWhiteData:[{'value':'0.8','name':'80%'},{'value':'0.85','name':'85%'}],
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[],
            },
            publicData:{
                agentsTypeData: ["未知","全球总代理","省代理","市代理","区县代理","其他"],
                shareholderType:["未知","发起人 10%","联合发起人 6%","创始发起人 3%","普通合伙人 1.5%"]
            },
            recordStatus:[{"value":"0","name":"审核中"},{"value":"1","name":"已通过"},{"value":"2","name":"已拒绝"}],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:3,
            currentData: {},
            defaultData:{
                merchantId: 0,
                merchantName: "",
                merchantType: "",
                merchantBusiness: "",
                merchantPhone: "",
                merchantAddress: "",
                merchantRatio: "",
                merchantLogo: "",
                merchantLng: "",
                merchantLat: "",
                merchantDescription: "",
                merchantImages: [],
                merchantTotalCash: "0.0000",
                merchantTotalScore: "0.0000",
                orderSuccessCount: 0,
                applicantName: "",
                applicantIdCard: "",
                applicantIdCardImage: "",
                userName: "",
                userStatus: 1,
                userMobile: "",
                userCloudAccount: "",
                userPassword:"",
                userConfirmPassword:"",
                userCloudStatus: 0,
                merchantCreateDateTime:"",
                applicantStatus:0,
                merchantProvinceId:"",
                merchantCityId:"",
                merchantDistrictId:"",
                merchantBDName:"",
                merchantBoutiqueSort:"",
                merchantYgbAccount:"",
                merchantPasswd:"",
                merchantConfirmPasswd:"",
                // merchantIsBoutique:0,
                merchantTypeMerchant:0,
                merchantBoutiqueSort:"",
                userewm:""
            },
            addDataValidate: {
                applicantStatus: [
                        { required: true, message: '请选择是否通过', trigger: 'change' }
                ],
            },
            updateStatusForm: {},
            updateStatusValidate: {
                readme: [
                    { required: true, message: '请输入备注说明', trigger: 'blur' }
                ]
            },
            oldPassError: '',
            updateStatus: false, // 修改密码模态框显示
            saveUpdateStatusLoading: false,
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:""
            },
            searchValidata: {},
            isShowCurrentImage:false,
            viewCurrentImage:""
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        },
        areaDataReady () {
            return !(this.areaData.areaDataReady==0);
        },
        doName () {
            if (this.doType=="list") return "代理申请管理";
            if (this.doType=="edit") return "商户详情";
            if (this.doType=="add") return "添加商户";
            return "商户详情";
        },
        currentDataValidate () {
         return this.addDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.merchant.merchant_list[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            };
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
            this.currentData=$.extend(true, {}, this.tableData[index]);
            this.doType="view";
        },
        showEdit (index) {
        	this.showTypeOff=false;
        	this.showTypeOn=false;
            this.currentData=$.extend(true, {}, this.tableData[index]);
            this.currentData.userewm=Config.apiRootPath+Config.api.public.ewm+"&merchantId="+this.currentData.merchantId;
            this.currentData.merchantRatio=this.tableData[index].merchantRatio*100;
            this.setCity(this.currentData.merchantProvinceId,true);
            this.setDistrict(this.currentData.merchantCityId,true);
            this.getListType(this.currentData.merchantTypeMerchant);
            this.doType="edit";
            if(this.currentData.is_direct==2){
            	this.showTypeOff=true;
            }else{
            	this.showTypeOn=true;
            }
        },
        //comm
        viewImage (imageUrl) {
            if(!imageUrl)return;
            this.viewCurrentImage=imageUrl;
            this.isShowCurrentImage=true;
        },
        closeViewImage (imageUrl) {
            this.viewCurrentImage="";
            this.isShowCurrentImage=false;
        },
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
        switchoverType (){
        	 if(this.currentData.is_direct==2){
            	this.showTypeOff=true;
            	this.showTypeOn=false;
           }else{
            	this.showTypeOn=true;
            	this.showTypeOff=false;
            }
        },
        //list
        resetSearch () {
            this.searchData={
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:""
            };
            this.page.pageNumber=1;
            this.init();
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
            this.dataReady=3;
            this.getList();
        },
        getListType (event) {
            if(event){
                this.dataReady=1;
            }
            let postData={
                ssid:Cookies.get('ssid'),
                type:event||2
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_list.type,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
                .done((data)=>{
                    // getBankCardList
                    this.dataReady--;
                    if(!!data){
                        if(data.code==0){
                            let typelist=[];
                            // for (let item in data.data){
                            //     typelist.push({ value: parseInt(item) ,label: data.data[item]});
                            // }
                            for(let i=0;i<data.data.length;i++){
                                typelist.push({ value: parseInt(data.data[i].id) ,label: data.data[i].name})
                            }
                            this.merchantTypeData=typelist;
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
        getList () {
            this.tableData=[];
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
            if(this.searchData.type!="")postData.status=this.searchData.type;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agentAudit.agentAuditList,
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
                        let listData=data.data.list;
                        listData.forEach((item)=>{
                            if(!item.merchantBDName)item.merchantBDName="";
                            if(!item.merchantBDId)item.merchantBDId="";
                            item.merchantYgbAccount=item.merchantYgbName;
                        });
                        this.tableData=listData;
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
        getMerchantType () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.public.merchantType,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                this.dataReady--;
                if(!!data){
                    if(data.code==0){
                        let typelist=[];
                        for (let item in data.data){
                            typelist.push({ value: parseInt(item) ,label: data.data[item]});
                        }
                        this.merchantTypeData=typelist;
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
        setProvince () {
            $.ajax({
                url: Config.apiRootPath+Config.api.public.getProvince,
                type: 'POST',
                dataType: 'json',
                data: { ssid:Cookies.get('ssid') }
            }).done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        let typelist=[];
                        for (let item in data.data){
                            typelist[parseInt(data.data[item].id)]={
                                id : data.data[item].id,
                                name : data.data[item].name
                            };
                        }
                        this.areaData.province=typelist;
                    }
                }
            });
        },
        setCity (provinceId,dataReset) {
            if(!provinceId)return;
            if(!dataReset){
                this.currentData.merchantCityId="";
                this.currentData.merchantDistrictId="";
            }
            this.areaData.citys=[];
            this.areaData.district=[];
            $.ajax({
                url: Config.apiRootPath+Config.api.public.getCity,
                type: 'POST',
                dataType: 'json',
                data: { ssid:Cookies.get('ssid') , pid : provinceId }
            }).done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        let typelist=[];
                        for (let item in data.data){
                            typelist[parseInt(data.data[item].id)]={
                                id : data.data[item].id,
                                name : data.data[item].name,
                                pid : data.data[item].pid
                            };
                        }
                        this.areaData.citys=typelist;
                    }
                }
            });
        },
        setDistrict (cityId,dataReset) {
            if(!cityId)return;
            this.areaData.district=[];
            if(!dataReset){
                this.currentData.merchantDistrictId="";
            }
            $.ajax({
                url: Config.apiRootPath+Config.api.public.getDistrict,
                type: 'POST',
                dataType: 'json',
                data: { ssid:Cookies.get('ssid') ,  cid : cityId }
            }).done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        let typelist=[];
                        for (let item in data.data){
                            typelist[parseInt(data.data[item].id)]={
                                id : data.data[item].id,
                                name : data.data[item].name,
                                cid : data.data[item].cid
                            };
                        }
                        this.areaData.district=typelist;
                    }
                }
            });
        },
        //add && edit
        saveEdit () {
            if(!this.hasDataChange)return;
            this.$refs['currentData'].validate((valid) => {

                if (valid) {
                    this.switching = true;

                    var postData = {};
                    postData.ssid                   = Cookies.get('ssid');
                    postData.merchantRatio          = (this.currentData.merchantRatio/100);
                    postData.merchantType           = this.currentData.merchantType;
                    postData.merchantBdMember       = this.currentData.merchantBDName;
                    postData.userName               = this.currentData.userName;
                    postData.merchantName           = this.currentData.merchantName;
                    postData.operating_area           = this.currentData.merchantArea;//商户面积
                    postData.merchantPhone          = this.currentData.merchantPhone;
                    postData.merchantAddress        = this.currentData.merchantAddress;
                    postData.applicantName          = this.currentData.applicantName;
                    postData.applicantIdCard        = this.currentData.applicantIdCard;
                    postData.merchantProvince       = this.currentData.merchantProvinceId;
                    postData.merchantCity           = this.currentData.merchantCityId;
                    postData.merchantDistrict       = this.currentData.merchantDistrictId;
                    postData.merchantYgbAccount     = this.currentData.merchantYgbAccount;
                    postData.userPassword           = this.currentData.userPassword||"";
                    postData.userConfirmPassword    = this.currentData.userConfirmPassword||"";
                    postData.merchantPasswd         = this.currentData.merchantPasswd||"";
                    postData.merchantConfirmPasswd  = this.currentData.merchantConfirmPasswd||"";
                    postData.is_direct              = this.currentData.is_direct;
                    // postData.merchantIsBoutique     = this.currentData.merchantIsBoutique||0;
                    postData.merchant_merchant_type     = this.currentData.merchantTypeMerchant||1;
                    postData.merchantBoutiqueSort   = this.currentData.merchantBoutiqueSort||"";

                    let requestUrl=Config.apiRootPath+Config.api.merchant.merchant_list.add;

                    if(this.doType=="edit"){
                        postData.merchantId=this.currentData.merchantId;
                        requestUrl=Config.apiRootPath+Config.api.merchant.merchant_list.edit;
                    };

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
                                if(this.doType=="add")this.doWhat("list");
                                this.$Message.success("账户保存成功！");
                                this.doWhat('list');
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
            })
        },
        //edit password
        changeStatus (index) {
          this.updateStatusForm=$.extend(true, {}, this.tableData[index]);
          this.updateStatusForm.tableIndex=index;
          this.updateStatus = true;
        },
        cancelUpdateStatus () {
            this.updateStatusForm={};
            this.updateStatus = false;
        },
        saveUpdateStatus () {
        	this.$refs['updateStatusForm'].validate((valid) => {
        	if(valid){
          this.saveUpdateStatusLoading = true;
            let postData={
                ssid:Cookies.get('ssid'),
                id:this.updateStatusForm.id,
                status:this.updateStatusForm.applicantStatus,
                member_id:this.updateStatusForm.member_id
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agentAudit.agentAuditListButton,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.saveUpdateStatusLoading=false;
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("操作成功！");
                        let newListData=$.extend(true, [], this.tableData);
                        newListData[this.updateStatusForm.tableIndex]=this.updateStatusForm;
                        this.updateStatusForm={};
                        this.tableData=newListData;
                        this.updateStatus = false;
                        this.doWhat('list');

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
                this.savePassLoading=false;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        		}
        	})
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
                url: Config.apiRootPath+Config.api.merchant.merchant_list.delete,
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
    mounted () {
        this.setProvince();
         this.init();
        // this.getListType();
    },
    activated (){
        this.doWhat("list");
        // this.getListType();
    }
};
</script>
