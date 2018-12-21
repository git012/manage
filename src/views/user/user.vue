<style lang="less">
    @import './user.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .item-list{ line-height: 30px; width:100%}
    .item-list .item-title{ font-weight: 900; text-align:right; background:#f5f5f5; padding: 0 6px; width:130px; color:#666}
    .item-list .item-content{  text-align:left; background:#fafafa; padding: 0 6px}
    @import "../../styles/common.less";
    .inline-form-item{ display:inline-block; }
    .need-inline-div {margin-top: 30px;margin-bottom: 30px}
    .need-inline-div span{display:inline-block;line-height:32px; padding:0 6px; }
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
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType=='edit'">
                    <Spin size="large" fix v-if="!viewDataReady"></Spin>
                    <Form
                        ref="currentData"
                        :model="currentData"
                        :label-width="150"
                        label-position="right"
                        :rules="currentDataValidate"
                    >
                        <FormItem label="用户名：">
                            <span class="color-blue">{{currentData.name}}</span>
                        </FormItem>
                        <FormItem label="用户等级：">
                            <span class="color-blue">{{userTypeData[currentData.level]}}</span>
                        </FormItem>
                        <FormItem label="推荐人：" >
                            <span class="color-blue">{{currentData.share_member_name}} [ {{currentData.share_member_real_name}} ] </span>
                        </FormItem>
                        <FormItem label="手机号码：" prop="mobile">
                            <div style="display:inline-block;width:200px;">
                                <Input v-model="currentData.mobile" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="身份证号码：" prop="id_card">
                            <div style="display:inline-block;width:200px;">
                                <Input v-model="currentData.id_card" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="" >
                            <Button type="primary" style="width: 100px;margin-right:10px" @click="saveEdit()">保存</Button>
                            <Button type="default" style="width: 100px;" @click="doWhat('list')">返回列表</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入用户名搜索">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                             <FormItem prop="share_member">
                                <Input type="text" v-model="searchData.share_member" placeholder="输入分享人搜索">
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
                        <Page v-if="page.dataCount>10" :total="page.dataCount" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
            <Modal v-model="viewUser" :closable='false' :mask-closable=false :width="500">
                <Spin size="large" fix v-if="!viewDataReady"></Spin>
                <h3 slot="header" style="color:#2D8CF0">用户详情</h3>
                <table class="item-list">
                    <tr><td class="item-title">用户名</td><td class="item-content">{{currentData.name}}</td></tr>
                    <tr><td class="item-title">姓名</td><td class="item-content">{{currentData.real_name}}</td></tr>
                    <tr><td class="item-title">性别</td><td class="item-content">{{user_sex[currentData.sex]}}</td></tr>
                    <tr><td class="item-title">手机号</td><td class="item-content">{{currentData.mobile}}</td></tr>
                    <tr><td class="item-title">用户等级</td><td class="item-content">{{userTypeData[currentData.level]}}</td></tr>
                    <tr><td class="item-title">是否代理</td><td class="item-content">{{is_agent[currentData.is_agent]}}</td></tr>
                    <tr><td class="item-title">是否股东</td><td class="item-content">{{is_shareholder[currentData.is_shareholder]}}</td></tr>
                    <tr><td class="item-title">推荐人</td><td class="item-content">{{currentData.share_member_name}} [ {{currentData.share_member_real_name}} ]</td></tr>
                    <tr><td class="item-title">创建时间</td><td class="item-content">{{currentData.created}}</td></tr>
                    <tr><td class="item-title">消费券额度</td><td class="item-content">{{currentData.amount_max}}</td></tr>
                    <tr><td class="item-title">身份证</td><td class="item-content">{{currentData.id_card}}</td></tr>
                </table>
                <div slot="footer">
                    <Button type="primary" @click="closeView">关闭</Button>
                </div>
            </Modal>


            <Modal
                    v-model="modal6"
                    title="绑定升级卡"
                    width="800"
                    :loading="loading"
                    >
                <Form
                        id="editForm"
                        ref="currentData"
                        :model="currentData"
                        :rules="currentDataValidate"
                        @submit="saveEdits"
                >
                    <Row>
                        <Col span="12">
                            <div class="clearboth">
                                <div style="width:120px; text-align:right; float:left; line-height:32px">分享合伙人卡号：</div>
                                <div style="width:250px; text-align:left; float:left">
                                    <template v-for="item,key in shareCard">
                                        <FormItem prop="share_start" class="inline-form-item" style="margin-bottom:8px">
                                            <Input v-model="shareCard[key]" @on-keyup="formatValue" @on-blur="checkvalue" placeholder="请输入卡号末四位"></Input>
                                        </FormItem>
                                        <Button v-if="key==0" style="margin-left:8px" icon="plus" @click="addShareCard()" type="success">添加</Button>
                                        <Button v-if="key>0" style="margin-left:8px" icon="close" @click="delShareCard(key)" type="error">删除</Button>
                                    </template>
                                </div>
                            </div>
                        </Col>
                        <Col span="12">
                            <div class="clearboth">
                                <div style="width:120px; text-align:right; float:left; line-height:32px">事业合伙人卡号：</div>
                                <div style="width:250px; text-align:left; float:left">
                                    <template v-for="item,key in enterpriseCard">
                                        <FormItem prop="share_start" class="inline-form-item" style="margin-bottom:8px">
                                            <Input v-model="enterpriseCard[key]" @on-keyup="formatValue" @on-blur="checkvalue" placeholder="请输入卡号末四位"></Input>
                                        </FormItem>
                                        <Button v-if="key==0" style="margin-left:8px" icon="plus" @click="addEnterpriseCard()" type="success">添加</Button>
                                        <Button v-if="key>0" style="margin-left:8px" icon="close" @click="delEnterpriseCard(key)" type="error">删除</Button>
                                    </template>
                                </div>
                            </div>
                        </Col>
                    </Row>


                    <div align="center" style="margin-top:15px;">
                        <Button :disable="hasDataChange" type="primary" style="width: 130px;" :loading="save_loading" @click="saveEdits()">开始绑定</Button>
                        <Button type="default" style="width: 130px; margin-left:33px" @click="cancelEdit" >返回列表</Button>
                    </div>
                </Form>
                <div slot="footer">
                    <!--<Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>-->
                </div>

            </Modal>
                <Modal
                        v-model="modal7"
                        title="卡列表"
                        width="1200"
                        :closable="false"
                >
                    <Table class="small_table" border :columns="columns7" :data="tableData7"></Table>
                    <div class="page-box">
                        <Page v-if="page1.dataCount>10" :total="page1.dataCount" :current="page1.pageNumber" show-total :page-size-opts="page1.pageSizeOpts" :page-size="page1.pageSize" @on-change="changePage1" @on-page-size-change="changePageSize1" show-elevator placement="top" show-sizer></Page>
                    </div>
                    <div slot="footer">
                        <Button size="large" long  @click="del">关闭</Button>
                    </div>
                </Modal>

                  <Modal
        v-model="modal1"
        title="会员新增购物积分"
    >
        <p style="height:30px"></p>
        <p> <span>新增金额：</span><Input v-model="newamount" style="width:70%" ></Input><span style="color: red">(单位：元)</span></p>
          <p style="height:30px"></p>
          <div slot="footer">
    <Button type="text" size="large" @click="cancel">取消</Button>
    <Button type="primary" size="large" @click="addSave">确定</Button>
   </div>

    </Modal>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
import MD5 from '../../libs/md5';
export default {
    name: 'user_list',
    data () {
        const valideMerchantType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择用户类型'));
            }
        };
        const valideMember = (rule, value, callback) => {
            if(this.currentData.share_start>0||this.currentData.share_end>0){
                if (value>0&&value<5000) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            }else{
                callback();
            };
        };
        const valideMember1 = (rule, value, callback) => {
            if(this.currentData.enterprise_start>0||this.currentData.enterprise_end>0){
                if (value>=5000&&value<=6000) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            }else{
                callback();
            };
        };
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.currentData.userPassword) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        const valideMerchantProvinceId = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择用户类型'));
            }
        };
        return {
            modal6: false,
            modal1:false,
            modal7:false,
            loading: true,
            columns7:[
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
                                    this.jebang(params)
                                }
                            }
                        }, '解绑');
                        let dobutton=[];

                        dobutton.push(manageChildButton);
                        // if(this.checkPower("hidden")){
                        //     dobutton.push(deleteButton);
                        // };

                        return h('div', dobutton);
                    }
                }
            ],
            columns: [
                {
                    title: 'ID',
                    // width: "60",
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '用户名',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '注册日期',
                    align: 'center',
                    key: 'created'
                },
                {
                    title: '手机号',
                    align: 'center',
                    key: 'mobile'
                },
                {
                    title: '分享人',
                    align: 'center',
                    key: 'share_member_name'

                },
                {
                    title: '性别',
                    key: 'sex',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span',{},this.user_sex[params.row.sex]);
                    }
                },
                {
                    title: '代理公司',
                    key: 'is_agent',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="非代理";
                        let style={color:"#a0a0a0"};

                        if(params.row.is_agent==1){
                            tagText=params.row.agent_name;
                            style={color:"#33f"};
                        };
                        return h('span', {style}, tagText);
                    }
                },
                {
                    title: '所属商户',
                    key: 'merchant_name',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="无";
                        let style={color:"#a0a0a0"};

                        if(params.row.merchant_name){
                            tagText=params.row.merchant_name;
                            style={color:"#33f"};
                        };
                        return h('span', {style}, tagText);
                    }
                },
//              {
//                  title: '是否股东',
//                  width:100,
//                  key: 'is_shareholder',
//                  align: 'center',
//                  render: (h, params) => {
//                      let tagcolor="default";
//                      let tagText="";
//                      return h('span', {}, this.is_shareholder[params.row.is_shareholder]);
//                  }
//              },
                {
                    title: '用户等级',
                    key: 'level',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        return h('span', {}, this.userTypeData[params.row.level]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 360,

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
                                        this.view(params.index)
                                    }
                                }
                            }, '详情');
                         let addviewButton=h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("newAdd",params.index)
                                    }
                                }
                            }, '发积分');


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
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("delete",params.index)
                                    }
                                }
                            }, '删除');

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
                                    this.faka(params)
                                }
                            }
                        }, '发卡');
                        let kButton=h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                             style: {
                                marginRight: '5px'
                            },

                            on: {
                                click: () => {
                                    this.Klist(params)
                                }
                            }
                        }, '卡列表');
                        let dobutton=[];

                        if(this.checkPower("view")){
                            dobutton.push(viewButton);
                        };
                        if(this.checkPower("edit")){
                            dobutton.push(editButton);
                        };
                        if(this.checkPower("delete")){
                            dobutton.push(deleteButton);
                        };
                        if(params.row.level!='0'){
                            dobutton.push(shareScaleButton);
                            dobutton.push(kButton);
                        };
                        dobutton.push(addviewButton);

                        return h('div', dobutton);
                    }
                }
            ],
            currentView:"",

            save_loading: false,
            shareCard:[""],
            enterpriseCard:[""],
            paramData:{
                agent:{},//代理商
                shareholder:{},//股东
                shareScale:{}//分红比例
            },
            saveType: "new",
            doType:"list",
            switching:false,
            tableData: [],
            user_sex:["未知","男","女"],
            is_shareholder:["非股东","股东"],
            is_agent:["非代理","代理"],
            userTypeData: ["普通会员","分享合伙人","事业合伙人"],
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[]
            },
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            page1: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:0,
            currentData: {},
            defaultData:{
                "id": "",
                "name": "",
                "mobile": "",
                "status": "",
                "level": "",
                "share_member_id": "",
                "amount_score": "",
                "shopping_score": "",
                "created": "",
                "amount_max": "",
                "yun_account": "",
                "yun_account_status": "",
                "id_card": ""
            },
            addDataValidate: {
            },
            editDataValidate: {
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' }
                ]
            },
            viewUser:false,
            viewDataReady:false,
            searchData:{
                keyword:"",
                share_member:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:0
            },
            getLoading7:false,
            tableData7:[],
            searchValidata: {},
            me:{},
            newamount:null,//积分
            modal1Index:null,
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
            if (this.doType=="list") return "用户基本信息管理";
            if (this.doType=="edit") return "编辑用户";
            if (this.doType=="add") return "添加用户";
            return "用户详情";
        },
        currentDataValidate () {
            if(this.doType=="add")return this.addDataValidate;
            return this.editDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    filters: {
      getSexName: function (value) {
        if (value==2) return '女';
        if (value==1) return '男';
        return '未知';
      }
    },
    methods: {
        del () {
            this.modal7 = false;

        },
        //解绑
        jebang(index){

            let postData={
                ssid:Cookies.get('ssid'),
                id:index.row.id,

            };
            // if(this.searchData.keyword!="")postData.card_no=Util.trim(this.searchData.keyword);

            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.jb,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
                .done((data)=>{
                    // this.dataReady--;
                    // getList
                    if(!!data){
                        if(data.code==0){
                            this.$Message.success("解绑成功！");
                            this.tableData7.splice(index.index, 1);
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
                    // this.dataReady--;
                    Config.showError({vm:this,
                        errorMsg:"服务器通讯失败"
                    });
                });
        },
        //卡列表
        Klist(index){
            this.faKlist(index);
        },
        faKlist(index){
            let postData={
                ssid:Cookies.get('ssid'),
                member_id:index.row.id,
                page:this.page1.pageNumber,
                pageSize:this.page1.pageSize
            };
            // if(this.searchData.keyword!="")postData.card_no=Util.trim(this.searchData.keyword);

            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.klist,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
                .done((data)=>{
                    // this.dataReady--;
                    // getList
                    if(!!data){
                        if(data.code==0){
                            this.modal7=true;
                            this.getLoading7=true;
                            this.page1.dataCount=data.data.count;
                            this.page1.pageCount=Math.ceil(this.page1.dataCount/this.page1.pageSize);
                            //format list data
                            this.tableData7=data.data.list;
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
                    // this.dataReady--;
                    Config.showError({vm:this,
                        errorMsg:"服务器通讯失败"
                    });
                });
        },
        cancelEdit () {
           this.modal6=false;
        },
        cancel(){
            this.modal1=false
            this.modal1Index=null,
           this.newamount=null
        },
        formatValue (e) {
            let v=e.target.value;
            v=v.replace(/[^\d]/g,'');
            e.target.value=v.substr(0,4);
        },
        checkvalue (e) {
            let v=e.target.value;
            v=v.replace(/[^\d]/g,'');
            if(v=="")return;
            if(v.length!=4){
                this.$Message.warning('请输入四位数字');
                e.target.focus();
            };
        },
        //add && edit
        saveEdits () {
            let shareCards="";
            for (var i = 0; i < this.shareCard.length; i++) {
                this.shareCard[i]=$.trim(this.shareCard[i]);
                if(this.shareCard[i]!=""&&this.shareCard[i].length==4){
                    if(shareCards!="")shareCards+=",";
                    shareCards+=this.shareCard[i];
                }
            };
            let enterpriseCards="";
            for (var i = 0; i < this.enterpriseCard.length; i++) {
                this.enterpriseCard[i]=$.trim(this.enterpriseCard[i]);
                if(this.enterpriseCard[i]!=""&&this.enterpriseCard[i].length==4){
                    if(enterpriseCards!="")enterpriseCards+=",";
                    enterpriseCards+=this.enterpriseCard[i];
                }
            };
            if(enterpriseCards==""&&shareCards=="")return;

            this.switching = true;

            let postData={
                ssid:Cookies.get('ssid'),
                member_id:this.me.row.id,
            };
            postData.share=shareCards;
            postData.enterprise=enterpriseCards;
            // console.log(postData);
            let _this=this;
            //拉取用户类型
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.k,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
                .done((data)=>{

                    //userTypeList
                    if(!!data){
                        this.switching=false;
                        if(data.code==0){
                            this.$Message.success(data.message);
                            this.modal6=false;
                            this.shareCard=[""];
                            this.enterpriseCard=[""]
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

        },
        addShareCard () {
            if(this.shareCard.length>10){
                this.$Message.warning('最多一次添加10张卡');
                return;
            };
            this.shareCard.push("");
        },
        delShareCard (index) {
            this.shareCard.splice(index, 1);
        },
        addEnterpriseCard () {
            if(this.enterpriseCard.length>10){
                this.$Message.warning('最多一次添加10张卡');
                return;
            };
            this.enterpriseCard.push("");
        },
        delEnterpriseCard (index) {
            this.enterpriseCard.splice(index, 1);
        },
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.user.user_list[dotype].MD5()];
        },
        doWhat (dotype,dataIndex) {

            // console.log(dotype);
            if(!this.checkPower(dotype)){
                // console.log(dotype);
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            }
            this.switching=true;
            if(dotype=="add"){
                this.resetCurrentData();
                this.doType="add";
            };

            if(dotype=="newAdd"){//发积分
                 // this.addSave(dataIndex);
                 this.modal1=true;
                 this.modal1Index=dataIndex;
            }
            if(dotype=="edit"){
                this.showEdit(dataIndex);
                this.doType="edit";
            };
            if(dotype=="delete"){
                this.delete(dataIndex);
            };
            if(dotype=="view"){
                this.view(dataIndex);
            };

            if(dotype=="list"){
                this.resetCurrentData();
                this.dataReady++;
                this.init();
                this.doType="list";
            };
            this.switching=false;
        },
        faka:function(index){
            this.modal6=true;
            this.me=index;
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
        changePage1 (pageNumber){
            this.page1.pageNumber=pageNumber;
            // this.search(pageNumber);
        },
        changePageSize1 (pageSize){
            this.page1.pageSize=pageSize;
            this.page1.pageCount=Math.ceil(this.page1.dataCount/this.page1.pageSize);
            // this.search();
        },
        //list
        resetSearch () {
            this.searchData={
                keyword:"",
                share_member:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                type:0
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
            this.doWhat("list");
        },
        init () {
            this.getList();
        },

         addSave (index) {

                  var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if (!re.test(this.newamount)) {
                        // callback(new Error('请输入正确格式的金额'));
                       
                         this.$Message.error('请输入正确格式的金额');
                        this.modal1=true
                    } else {

                         let postData={
                            ssid:Cookies.get('ssid'),
                            memberId:this.tableData[this.modal1Index].id,
                            score:Number(this.newamount)
                        };
                        $.ajax({
                            url:  Config.apiRootPath+Config.api.user.user_list.newAdd,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                        .done((data)=>{
                            this.dataReady--;
                            // getList
                            if(!!data){
                                if(data.code==0){
                                    this.dataReady=0
                                   // this.tableData=data.data.list;
                                    this.modal1=false
                                    this.modal1Index=null,
                                    this.newamount=null
                                    this.$Message.success("新增添加成功");
                                    this.doWhat("list");
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
                        
                    }
              
                       
                
            },
        getList () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            
            if(this.searchData.keyword!="")postData.name=Util.trim(this.searchData.keyword);
            if(this.searchData.share_member!="")postData.share_member=Util.trim(this.searchData.share_member);

            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.list,
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
        //view
         view (index) {
            this.currentData=$.extend(true, {}, this.tableData[index]);
            this.viewDataReady=false;
            this.getDetail(this.currentData.id);
            this.viewUser=true;
        },
        closeView (){
            this.viewUser=false;
        },
        getDetail (member_id) {
            let postData={
                ssid:Cookies.get('ssid'),
                member_id:member_id
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.view,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.viewDataReady=true;
                // getList
                if(!!data){
                    if(data.code==0){
                        this.currentData=data.data;
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
                this.viewDataReady=true;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });

        },
        //add && edit
        showEdit (index) {
            this.viewDataReady=false;
            this.getDetail(this.tableData[index].id);
            this.doType="edit";
        },
        saveEdit () {
            if(!this.hasDataChange)return;
            this.$refs['currentData'].validate((valid) => {

                if (valid) {
                    this.switching = true;

                    var postData = {
                        ssid:Cookies.get('ssid'),
                        mobile:this.currentData.mobile,
                        id_card:this.currentData.id_card
                    };

                    let requestUrl=Config.apiRootPath+Config.api.user.user_list.add;

                    if(this.doType=="edit"){
                        postData.member_id=this.currentData.id;
                        requestUrl=Config.apiRootPath+Config.api.user.user_list.edit;
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
                                this.$Message.success("修改成功！");
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
                        Config.showError({vm:this,data:data,
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
                    member_id:this.tableData[index].id,
                    status:0
                });
            $.ajax({
                url: Config.apiRootPath+Config.api.user.user_list.delete,
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
    },
    activated (){
        this.doWhat("list");
    }
};
</script>
