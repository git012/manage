<style lang="less">
    @import './merchant.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shopshow{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px;z-index:999;display: block;}
    /*.shop-ewm img{width:180px; height: auto; border:1px solid #dededf}*/
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
                        :label-width="150"
                        label-position="right"
                        :rules="currentDataValidate"
                    >
                 
                        <FormItem label="商户名称：" prop="merchantName">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantName"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商户账号：" prop="merchantNameAccount">
                            <div style="width:200px;">
                                <Input v-model="currentData.userName" readonly="readonly"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商户面积：" prop="operating_area">
                            <div style="width:280px;">
                                <Input  style="width:200px;"  v-model="currentData.operating_area" ></Input>
                                <span style="color:red">单位：㎡</span>
                            </div>

                        </FormItem>
                        <FormItem label="商户区域：" prop="merchantProvinceId">
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
                        <FormItem label="经营地址：" prop="merchantAddress">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantAddress"></Input>
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
                        <FormItem label="经营业务：" prop="merchantBusinessM">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessM"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="实际经营负责人：" prop="merchantBusinessDirector">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessDirector"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="负责人联系电话：" prop="merchantBusinessPhone">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBusinessPhone"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="商家服务电话：" prop="merchantPhone">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantPhone"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="悟空团账号：" prop="merchantWktName" >
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWktName" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="悟空团注册手机号：" prop="merchantWktMobile" >
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWktMobile" readonly></Input>
                            </div>
                        </FormItem>
                        <FormItem label="分享人用户名：" prop="merchantBDName">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantBDName"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人姓名：" prop="applicantName">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantName"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人联系方式：" prop="applicantPhone">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantPhone"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="法人身份证号码：" prop="applicantIdCard">
                            <div style="width:200px;">
                                <Input v-model="currentData.applicantIdCard"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="社会信用代码：" prop="merchantSocialCreditCode">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantSocialCreditCode"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="支付宝收款号：" prop="merchantAlipay">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantAlipay"></Input>
                            </div>
                        </FormItem>
                        <FormItem label="微信收款号：" prop="merchantWeChat">
                            <div style="width:200px;">
                                <Input v-model="currentData.merchantWeChat"></Input>
                            </div>
                        </FormItem>
                    	<!--<FormItem label="身份证正面照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.applicantIdCardImage)" height="60" :src="currentData.applicantIdCardImage" />
                    	</FormItem>-->
                        <FormItem label="身份证正面照：">
                            <noUpFileInput :fileInfro="currentData.face"></noUpFileInput>
                        </FormItem>                    	
                    	<!--<FormItem label="身份证反面照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.applicantIdCardImage2)" height="60" :src="currentData.applicantIdCardImage2" />
                    	</FormItem>-->
                    	<FormItem label="身份证反面照：">
                            <noUpFileInput :fileInfro="currentData.face2"></noUpFileInput>
                        </FormItem>  
                    	<!--<FormItem label="营业执照：" style="margin-bottom:0px">
                        	<img class="viewImg" @click="viewImage(currentData.merchantBusiness)" height="60" :src="currentData.merchantBusiness" />
                    	</FormItem>-->
                    	<FormItem label="营业执照：">
                            <noUpFileInput :fileInfro="currentData.face3"></noUpFileInput>
                        </FormItem>  
                        <FormItem label="登录密码：" prop="userPassword">
                            <div style="width:204px;">
                                <Input v-model="currentData.userPassword" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="确认登录密码：" prop="userConfirmPassword">
                            <div style="width:204px;">
                                <Input v-model="currentData.userConfirmPassword" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="提现密码：" prop="merchantPasswd">
                            <div style="width:204px;">
                                <Input v-model="currentData.merchantPasswd" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="确认提现密码：" prop="merchantConfirmPasswd">
                            <div style="width:204px;">
                                <Input v-model="currentData.merchantConfirmPasswd" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="" >
                            <Button type="primary" style="width: 100px;margin-right:10px" @click="saveEdit">保存</Button>
                            <Button type="default" style="width: 100px;" @click="doWhat('list')">返回列表</Button>
                        </FormItem>
                    </Form>
                   	<template>
                 		<div class="shopshow">
                 			<div id="qrcode" ref="qrcode"></div>
            				<div><br>点击右键选择图片另存为<br>即可下载二维码</div>
                 		</div>
            		</template>
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称或者帐号搜索商户">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <!--<FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>-->
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
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">

                    <FormItem label="商户帐号：" style="margin-bottom:0px">
                        {{updateStatusForm.userName}}
                    </FormItem>
                    <FormItem label="店铺logo：" style="margin-bottom:0px">
                        <img class="viewImg" @click="viewImage(updateStatusForm.merchantLogo)" height="60" :src="updateStatusForm.merchantLogo" />
                    </FormItem>
                    <FormItem label="店铺照片：" style="margin-bottom:0px">
                        <img class="viewImg" @click="viewImage(item.image)" v-for="item in updateStatusForm.merchantImages" width="19%" style="margin-right:2px" :src="item.image" />
                    </FormItem>
                    <FormItem label="营业执照：" style="margin-bottom:0px">
                        <img class="viewImg" @click="viewImage(updateStatusForm.merchantBusiness)" height="60" :src="updateStatusForm.merchantBusiness" />
                    </FormItem>
                    <FormItem label="店铺地址：" style="margin-bottom:0px">
                        {{updateStatusForm.merchantAddress}}
                    </FormItem>
                    <FormItem label="地图经度：" style="margin-bottom:0px">
                        {{updateStatusForm.merchantLng}}
                    </FormItem>
                    <FormItem label="地图纬度：" style="margin-bottom:0px">
                        {{updateStatusForm.merchantLat}}
                    </FormItem>
                    <FormItem label="商户名称：" style="margin-bottom:0px">
                        {{updateStatusForm.merchantName}}
                    </FormItem>
                    <FormItem label="审核状态：" prop="status">
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
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
import QRCode from 'qrcodejs2';
export default {
    name: 'merchant_list',
    components: {
        noUpFileInput,
        QRCode
    },
    data () {
        const valideMerchantType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择商户类型'));
            }
        };
        const valideMerType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择店铺类型'));
            }
        };     
        const valideMerTypeM = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择商户类型'));
            }
        };  
        const validRatio = (rule, value, callback) => {
            if (value>=0&&value<100) {
                callback();
            } else {
                callback(new Error('商户折扣差数值应在0-100之间！'));
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
                    align: 'center',
                    key: 'userName'
                },
                {
                    title: '商户名称',
                    align: 'center',
                    key: 'merchantName'
                },
                {
                    title:'商户面积',
                    align: 'center',
                    key:'operating_area',
                },
                {
                    title: '联系人',
                    // width: "6%",
                    align: 'center',
                    key: 'applicantName'
                },
                {
                    title: '商户电话',
                    align: 'center',
                    // width: "94",
                    key: 'merchantPhone'
                },
                {
                    title: '地区',
                    align: 'center',
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
                {
                    title: '白积分商品折扣差',
                    align: 'center',
                    key: 'merchantWhitePointDiscount',
                    render: (h, params) => {
                           let tagText=params.row.merchantWhitePointDiscount*100+"%";
                           return h('span', {}, tagText);
                      }
                },
                {
                    title: '商户折扣差',
                    align: 'center',
                    key: 'merchantRatio',
                    render: (h, params) => {
                           let tagText=params.row.merchantRatio*100+"%";
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
                            }, '修改');
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
            imagesReady:false,
            tableData: [],
            merchantTypeData: [],
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
                merchantRatio: "0.0000",
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
                merchantBoutiqueSort:"",
                userewm:"",
                face: {
                    url:"",
                    file:"",
                    fileObjName:"身份证正面照",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                face2: {
                    url:"",
                    file:"",
                    fileObjName:"身份证反面照",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                face3: {
                    url:"",
                    file:"",
                    fileObjName:"营业执照",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                }
            },
//编辑表单验证
            addDataValidate: {
                merchantName: [
                    { required: true, message: '请输入商户名称', trigger: 'blur' }
                ],
                merchantNameAccount:[
                    { required: true, message: '请输入商户账号', trigger: 'blur' }
                ],
                merchantArea: [
                    { required: true, message: '请输入商户面积', trigger: 'blur' }
                ],
                applicantIdCard:[
                    { required: true, message: '请输入身份证号' },
                    { validator: idcard }
                ],
                userName: [
                    { required: true, message: '请输入商户帐号', trigger: 'blur' }
                ],
                merchantYgbAccount: [
                    { required: true, message: '请输入商户预购宝帐号或电话', trigger: 'blur' }
                ],
                merchantPhone: [
                    { required: true, message: '请输入商户电话' },
                    { validator: validePhone }
                ],
                userPassword: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                userConfirmPassword: [
                    { required: true, message: '请再次输入登录密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ],
                merchantPasswd: [
                    { required: true, message: '请输入提现密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                merchantConfirmPasswd: [
                    { required: true, message: '请再次输入提现密码', trigger: 'blur' },
                    { validator: valideCashPassword, trigger: 'blur' }
                ],
                merchantRatio: [
                    { required: true,validator: validRatio, message: '请输入签约比率', trigger: 'blur' }
                ],
                merchantType: [
                    { required: true, validator: valideMerchantType, trigger: 'blur' }
                ],
                // merchantBDName: [
                //     { required: true, message: '请输入分享人用户名', trigger: 'blur' }
                // ],
                merchantBoutiqueSort: [
                    { required: true, validator: valideMerchantBoutiqueSort,  trigger: 'blur' }
                ],
               MerchantBoutiquemerchantIsshop: [
                    { required: true, validator: valideMerchantBoutiquemerchantIsshop,  trigger: 'blur' }
                ],

                merchantProvinceId: [
                    { required: true, validator: valideMerchantProvinceId, trigger: 'blur' }
                ]
            },
            editDataValidate: {
                merchantName: [
                    { required: true, message: '请输入商户名称', trigger: 'blur' }
                ],
                operating_area: [
                    { required: true, message: '请输入商户面积', trigger: 'blur' }
                ],
                merchantAddress: [
                    { required: true, message: '请输入经营地址', trigger: 'blur' }
                ],
                applicantIdCard:[
                    { required: true, message: '请输入身份证号' },
                    { validator: idcard }
                ],
                merchantBusinessM: [
                    { required: true, message: '请输入经营业务', trigger: 'blur' }
                ],
                merchantBusinessDirector: [
                    { required: true, message: '请输入实际经营负责人', trigger: 'blur' }
                ],
                merchantBusinessPhone: [
                    { required: true, message: '请输入负责人联系电话' },
                    { validator: validePhone }
                ],
                merchantPhone: [
                    { required: true, message: '请输入商家服务电话' },
                    { validator: validePhone }
                ],
                merchantWktName: [
                    	{ required: true, message: '请输入悟空团账号',trigger: 'blur' }
                    ],
                    merchantWktMobile: [
                    	{ required: true, message: '请输入悟空团注册手机号',trigger: 'blur' }
                    ],
                    merchantBDName: [
                    	{ required: true, message: '请输入分享人用户名',trigger: 'blur' }
                    ],
                    applicantName: [
                    	{ required: true, message: '请输入法人姓名',trigger: 'blur' }
                    ],
                    applicantPhone: [
                    	{ required: true, message: '请输入法人联系方式',trigger: 'blur' }
                    ],
                    merchantSocialCreditCode: [
                    	{ required: true, message: '请输入社会信用代码',trigger: 'blur' }
                    ],
                    merchantAlipay: [
                    	{ required: false, message: '请输入支付宝收款号',trigger: 'blur' }
                    ],
                    merchantWeChat: [
                    	{ required: false, message: '请输入微信收款号',trigger: 'blur' }
                    ],
                    is_direct: [
                    	{ required: true,validator: valideMerType,trigger: 'change' }
                    ],
                    merchantTypeMerchant: [
                    	{ required: true,validator: valideMerTypeM,trigger: 'change' }
                    ],
                userPassword: [
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                userConfirmPassword: [
                    { validator: valideRePassword, trigger: 'blur' }
                ],
                merchantPasswd: [
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                merchantConfirmPasswd: [
                    { validator: valideCashPassword, trigger: 'blur' }
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
                type:"",
                type2:""
            },
            searchValidata: {},
            ewmCode:"",
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
            if (this.doType=="list") return "商户基本信息管理";
            if (this.doType=="edit") return "编辑商户";
            if (this.doType=="add") return "添加商户";
            return "商户详情";
        },
        currentDataValidate () {
            return this.editDataValidate;
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
            var jsonStr = JSON.stringify(this.currentData.code);
            this.ewmCode=jsonStr;
           	this.$nextTick (function () {
   					this.qrcode();
				})
            this.currentData.face={
                                        url:this.currentData.applicantIdCardImage,
                                        file:"",
                                        fileObjName:"身份证正面照",
                                        uploadMenu:"选择图片",
                                        uploadType:"sync",
                                        type:"image",
                                        maxSize:2048
                                    };
            this.currentData.face2={
                                        url:this.currentData.applicantIdCardImage2,
                                        file:"",
                                        fileObjName:"身份证反面照",
                                        uploadMenu:"选择图片",
                                        uploadType:"sync",
                                        type:"image",
                                        maxSize:2048
                                    };
            this.currentData.face3={
                                        url:this.currentData.merchantBusiness,
                                        file:"",
                                        fileObjName:"营业执照",
                                        uploadMenu:"选择图片",
                                        uploadType:"sync",
                                        type:"image",
                                        maxSize:2048
                                    };
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
        resetCurrentData () {
            this.currentData = $.extend(true, {}, this.defaultData);
        },
        closeViewImage (imageUrl) {
            this.viewCurrentImage="";
            this.isShowCurrentImage=false;
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
        qrcode () {
				let qrcode = new QRCode('qrcode', {  
      			width: 180,  // 设置宽度 
      			height:180, // 设置高度
      			text:this.ewmCode
			})  
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
                pageSize:this.page.pageSize,
            };
            if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
            if(this.searchData.type!='')postData.applicantStatus=this.searchData.type;
            if(this.searchData.type2!='')postData.applicantStatusOrder=this.searchData.type2;
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
                    var formDataSe = new FormData();
                    formDataSe.append("ssid", Cookies.get('ssid'));
                    formDataSe.append("merchantName", this.currentData.merchantName);
                    formDataSe.append("userName", this.currentData.userName);
                    formDataSe.append("operating_area", this.currentData.operating_area);
                    formDataSe.append("merchantProvince",this.currentData.merchantProvinceId);
                    formDataSe.append("merchantCity",this.currentData.merchantCityId);
                    formDataSe.append("merchantDistrict",this.currentData.merchantDistrictId);
                    formDataSe.append("merchantAddress",this.currentData.merchantAddress);
                    formDataSe.append("is_direct",this.currentData.is_direct);
                    formDataSe.append("merchantTypeMerchant",this.currentData.merchantTypeMerchant);
                    formDataSe.append("merchantType",this.currentData.merchantType);
                    formDataSe.append("merchantBusinessM", this.currentData.merchantBusinessM);
                    formDataSe.append("merchantBusinessDirector",this.currentData.merchantBusinessDirector);
                    formDataSe.append("merchantBusinessPhone", this.currentData.merchantBusinessPhone);
                    formDataSe.append("merchantPhone",this.currentData.merchantPhone);
                    formDataSe.append("merchantWktName",this.currentData.merchantWktName);
                    formDataSe.append("merchantWktMobile",this.currentData.merchantWktMobile);
                    formDataSe.append("merchantBDName",this.currentData.merchantBDName);
                    formDataSe.append("applicantName",this.currentData.applicantName);
                    formDataSe.append("applicantPhone",this.currentData.applicantPhone);
                    formDataSe.append("applicantIdCard",this.currentData.applicantIdCard);
                    formDataSe.append("merchantSocialCreditCode",this.currentData.merchantSocialCreditCode);
                    formDataSe.append("merchantAlipay",this.currentData.merchantAlipay);
                    formDataSe.append("merchantWeChat",this.currentData.merchantWeChat);
                    formDataSe.append("userPassword",this.currentData.userPassword || "");
                    formDataSe.append("userConfirmPassword",this.currentData.userConfirmPassword || "");
                    formDataSe.append("merchantPasswd", this.currentData.merchantPasswd || "");
                    formDataSe.append("merchantConfirmPasswd",this.currentData.merchantConfirmPasswd || "");
                    let requestUrl=Config.apiRootPath+Config.api.merchant.merchant_list.add;
                    if(this.currentData.face.file){
                        formDataSe.append("applicantIdCardImage", this.currentData.face.file);
                    };
                    if(this.currentData.face2.file){
                        formDataSe.append("applicantIdCardImage2", this.currentData.face2.file);
                    };
                    if(this.currentData.face3.file){
                        formDataSe.append("merchantBusiness", this.currentData.face3.file);
                    };
                    if(this.doType=="edit"){
                        formDataSe.append("merchantId", this.currentData.merchantId);
                        requestUrl=Config.apiRootPath+Config.api.merchant.merchant_list.edit;
                    };
                    let _this=this;
                    console.log(formDataSe);
                    //拉取用户类型
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: formDataSe,
                        cache: false,  
                        contentType: false,  
                        processData: false 
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
            this.saveUpdateStatusLoading = true;
            let postData={
                ssid:Cookies.get('ssid'),
                id:this.updateStatusForm.merchantId,
                status:this.updateStatusForm.applicantStatus
            };

            $.ajax({
                url: Config.apiRootPath+Config.api.merchant.merchant_list.review,
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
        // this.getListType();
    },
    activated (){
        this.doWhat("list");
        // this.getListType();
    }
};
</script>
