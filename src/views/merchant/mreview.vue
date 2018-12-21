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
                <div v-if="doType=='add'||doType=='edit'">
                    <Form
                        ref="currentData"
                        :model="currentData"
                        :label-width="180"
                        label-position="right"
                   		>
                        <FormItem label="商户名称：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商户面积：">
                            <div style="width:280px;">
                                <Input  style="width:200px;"  v-model="currentData.operating_area" readonly></Input>
                                <span style="color:red">单位：㎡</span>
                            </div>

                        </FormItem>
                        <FormItem label="商户区域：">
                            <div style="display:inline-block;width:140px;">
                                <Select v-model="currentData.merchantProvinceId" placeholder="请选择省份" @on-change="setCity">
                                    <Option v-if="item" v-for="item in areaData.province" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                            <div style="display:inline-block;width:140px;">
                                <Select v-if="areaData.citys.length&&currentData.merchantProvinceId" placeholder="请选择城市" v-model="currentData.merchantCityId" @on-change="setDistrict">
                                    <Option v-if="item" v-for="item in areaData.citys" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                            <div style="display:inline-block;width:140px;">
                                <Select v-if="areaData.district.length&&currentData.merchantCityId" placeholder="请选择区县" v-model="currentData.merchantDistrictId">
                                    <Option v-if="item" v-for="item in areaData.district" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="经营地址：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantAddress" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商户类型：" prop="merchantTypeMerchant">
                            <RadioGroup v-model="currentData.merchantTypeMerchant" @on-change="switchoverType">
                                <Radio :label="1">
                                    <span>线下商家(悟空商圈)</span>
                                </Radio>
                                <Radio :label="2">
                                    <span>线上商家(悟空商城)</span>
                                </Radio>
                                <Radio :label="3">
                                    <span>白积分商城</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
						<FormItem label="是否直营店：" prop="is_direct">
                            <RadioGroup v-model="currentData.is_direct">
                                <Radio :label="1">
                                    <span>直营店</span>
                                </Radio>
                                <Radio :label="2">
                                    <span>联盟商家</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem label="所属行业：" v-if="showTypeOff">
                            <div style="display:inline-block;width:140px;">
                                <Select v-model="currentData.merchantType">
                                    <Option v-if="item" v-for="item in areaData.typeMerchant" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="所属行业：" v-if="showTypeOn">
                            <div style="display:inline-block;width:140px;">
                                <Select v-model="currentData.merchantType">
                                    <Option v-if="item" v-for="item in areaData.typeMerchantOn" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="经营业务：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessM" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="实际经营负责人：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessDirector" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="负责人联系电话：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessPhone" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商家服务电话：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantPhone" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="悟空团账号：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWktName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="悟空团注册手机号：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWktMobile" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="分享人用户名：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBDName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人姓名：" >
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人联系方式：">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantPhone" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人身份证号码：">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantIdCard" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="社会信用代码：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantSocialCreditCode" readonly></Input>
                            </div>
                        </FormItem>
                        <!--<FormItem label="微信号：">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantWeChat" readonly></Input>
                            </div>
                        </FormItem>-->
                        <!--<FormItem label="银行名称：">
                            <div style="display:inline-block;width:140px;">
                                <Select v-model="currentData.merchantProvinceId" placeholder="请选择省份" @on-change="setCity" disabled="disabled">
                                    <Option v-if="item" v-for="item in areaData.province" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="收款银行账号(公司约可)：">
                            <div style="width:200px;">
                                <Input v-model="currentData.bankNumber" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="开户名：">
                            <div style="width:200px;">
                                <Input v-model="currentData.bankUserName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="开户行：">
                            <div style="width:200px;">
                                <Input v-model="currentData.bankOpeningBank" readonly></Input>
                            </div>
                        </FormItem>-->
                        <FormItem label="支付宝收款号：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantAlipay" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="微信收款号：">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWeChat" readonly></Input>
                            </div>
                        </FormItem>
                    	<FormItem label="身份证正面照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.applicantIdCardImage)" height="60" :src="currentData.applicantIdCardImage" />
                    	</FormItem>
                    	<FormItem label="身份证反面照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.applicantIdCardImage2)" height="60" :src="currentData.applicantIdCardImage2" />
                    	</FormItem>
                    	<FormItem label="营业执照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.merchantBusiness)" height="60" :src="currentData.merchantBusiness" />
                    	</FormItem>
                       <FormItem label="" >
                            <Button type="default" style="width: 100px;" @click="doWhat('list')">返回列表</Button>
                        </FormItem>
                    </Form>
                </div>
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
                            <Select @on-change="search()" v-model="searchData.type2" style="width:150px" placeholder="请选择列表排序方式" >
                                <Option v-for="item in recordStatus2" :value="item.value" >{{ item.name }}</Option>
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
                <h3 slot="header" style="color:#2D8CF0">商户审核</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="180" label-position="right" :rules="currentDataValidate">
                    <FormItem label="选择白积分商品折扣差：" prop="merchantRatior">
                            <div style="width:300px;">
                                <Select style="width:200px" v-model="updateStatusForm.merchantRatior">
                                    <Option v-for="item in zkWhiteData" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                </Select>
                            </div>
                    </FormItem>                    
                    <FormItem label="选择商户折扣差：" prop="merchantTyper">
                            <div style="width:300px;">
                                <Select style="width:200px" v-model="updateStatusForm.merchantTyper">
                                    <Option v-for="item in zkData" :value="item.value" :key="item.value">{{ item.name }}</Option>
                                </Select>
                            </div>
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
        const valideMerchantType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择商户类型'));
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
                    // width: "60",
                    align: 'center',
                    key: 'merchantId'
                },
                {
                    title: '帐号',
                    key: 'userName'
                },
                {
                    title: '商户名称',
                    key: 'merchantName'
                },
                {
                    title:'商户面积',
                    key:'operating_area',
                },
                {
                    title: '联系人',
                    // width: "6%",
                    key: 'applicantName'
                },
                {
                    title: '商户电话',
                    // width: "94",
                    key: 'merchantPhone'
                },
                {
                    title: '地区',
                    key: 'merchantProvinceId',
                    render: (h, params) => {
                        let tagText=params.row.merchantProvinceName+params.row.merchantCityName+params.row.merchantDistrictName;
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '分享人',
                    align: 'center',
                    // width: "94",
                    key: 'merchantBDName'
                },
                {
                    title: '商户类型',
                    align: 'center',
                    // width: "94",
                    key: 'merchantTypeName'
                },
                // {
                //     title: '商户类型',
                //     key: 'merchantType',
                //     // width: "66",
                //     align: 'center',
                //     render: (h, params) => {
                //         let tagcolor="default";
                //         let tagText="";
                //
                //         $.each(this.merchantTypeData,(small_index, small_el)=>{
                //             if(params.row.merchantType==small_el.value)tagText=small_el.label
                //         })
                //         return h('span', {}, tagText);
                //     }
                // },
                {
                    title: '订单',
                    // width: "5%",
                    align: 'center',
                    key: 'orderSuccessCount'
                },
                // {
                //     title: '余额',
                //     align: 'right',
                //     key: 'merchantTotalCash'
                // },
                {
                    title: '状态',
                    key: 'applicantStatusApp',
                    // width: "80",
                    align: 'center',
                    render: (h, params) => {

                        let tagcolor="default";
                        let tagText="审核中";
                        if(params.row.applicantStatusApp==1){
                            tagcolor="green";tagText="已通过";
                        };
                        if(params.row.applicantStatusApp==2){
                            tagcolor="red";tagText="已拒绝";
                        };
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        // let viewButton=h('Button', {
                        //         props: {
                        //             type: 'primary',
                        //             size: 'small'
                        //         },
                        //         style: {
                        //             marginRight: '5px'
                        //         },
                        //         on: {
                        //             click: () => {
                        //                 this.view(params.index)
                        //             }
                        //         }
                        //     }, '详情');
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

                        if(this.checkPower("edit")){
                            dobutton.push(editButton);
                        };
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
            	typeMerchant:[{'id':1,'name':'美食'},
                			 {'id':2,'name':'酒店'},
                			 {'id':3,'name':'休闲娱乐'},
                			 {'id':4,'name':'生活服务'},
                			 {'id':5,'name':'百货超市'},
                			 {'id':6,'name':'丽人/美发'},
                			 {'id':7,'name':'旅游'},
                			 {'id':8,'name':'汽车'},
                			 {'id':9,'name':'房产'},
                			 {'id':10,'name':'其他'}],
        		typeMerchantOn:[{'id':1,'name':'女鞋箱包'},
                			 {'id':2,'name':'美妆'},
                			 {'id':3,'name':'腕表珠宝'},
                			 {'id':4,'name':'手机数码'},
                			 {'id':5,'name':'母婴玩具'},
                			 {'id':6,'name':'零食茶酒'},
                			 {'id':7,'name':'生鲜水果'},
                			 {'id':8,'name':'生活家电'},
                			 {'id':9,'name':'家具建材'},
                			 {'id':10,'name':'汽车/配件/用品'},
                			 {'id':11,'name':'家纺/家饰/鲜花'},
                 			 {'id':12,'name':'医药保健'},
                			 {'id':13,'name':'厨具/收纳/宠物'}]
            },
            recordStatus:[{"value":"0","name":"审核中"},{"value":"1","name":"已通过"},{"value":"2","name":"已拒绝"}],
            recordStatus2:[{"value":"","name":"默认排序"},{"value":"0","name":"审核中靠前"},{"value":"2","name":"已拒绝靠前"},{"value":"1","name":"已通过靠前"}],
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
                merchantRatior: [
                    { required: true,message: '请选择白积分商品折扣差', trigger: 'change' }
                ],
                merchantTyper: [
                    { required: true, message: '请选择选择商户折扣差', trigger: 'change' }
                ],
                applicantStatus: [
                        { required: true, message: '请选择是否通过', trigger: 'change' }
                    ]
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
                type:"",
                type2:""
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
            if (this.doType=="list") return "商户申请管理";
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
            if(this.currentData.merchantTypeMerchant==1){
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
        	 if(this.currentData.merchantTypeMerchant==1){
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
            this.getListType();
            this.getMerchantType();
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
            if(this.searchData.type!="")postData.applicantStatusApp=this.searchData.type;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            if(this.searchData.type2!='')postData.applicantStatusAppOrder=this.searchData.type2;
            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_list.list,
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
                id:this.updateStatusForm.merchantId,
                status:this.updateStatusForm.applicantStatus,
                merchantWhitePointDiscount:this.updateStatusForm.merchantRatior,
                merchantRatio:this.updateStatusForm.merchantTyper
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_list.reviewApp,
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
