<style lang="less">
    @import './assignments.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
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
                <Button type="primary" class="add-btu" size="small" 
                    v-if="checkPower('add')&&doType=='list'" 
                    @click="doWhat('add')" >添加账户
                </Button>
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form 
                        ref="currentData"
                        :model="currentData" 
                        :label-width="100" 
                        label-position="right"
                        :rules="currentDataValidate"
                    >
                        <FormItem label="用户帐号：" prop="account">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.account" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="用户姓名：" prop="name">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.name" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="用户手机：" prop="mobile" >
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.mobile" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="头像：" prop="face">
                            <noUpFileInput :fileInfro="currentData.face"></noUpFileInput>
                        </FormItem>
                        <FormItem label="部门：" prop="user_group_id">
                            <div style="width:204px;">
                                <Select v-model="currentData.user_group_id" placeholder="请选择部门">
                                    <Option v-for="(item,key) in groupData" v-if="item" :label="item.name" :value="item.id" :key="item.id"><label class="bank-card-username">{{item.name}}</label></Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="登录密码：" prop="password" v-if="(checkPower('modifyPassword')&&doType=='edit')||doType=='add'">
                            <div v-if="doType=='add'" style="display:inline-block;width:204px;">
                                <Input v-model="currentData.password" ></Input>
                            </div>
                            <Button v-if="checkPower('modifyPassword')&&doType=='edit'" size="small" @click="showEditPassword(currentData.id)">点击修改密码</Button>
                        </FormItem>
                        <div>
                            <Button type="text" style="width: 100px;" @click="doWhat('list')">取消</Button>
                            <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
                        </div>
                    </Form>    
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索帐号">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" icon="search" @click="search()">搜索</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                    <div class="page-box">
                    <Page v-if="page.pageCount>1" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>    
            </div>
            <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
                <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                    <input style="display:none" type="password" name="notAutoComplete" />
                    <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                        <Input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPass">
                        <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                    </FormItem>
                    <FormItem label="确认新密码" prop="rePass">
                        <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEditPass">取消</Button>
                    <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
import Cookies from 'js-cookie';


export default {
    name: 'admin_assignments',
    components: {
        noUpFileInput
    },
    data () {
        const valideUserGroupId = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择部门'));
            }
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
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        const valideFace = (rule, value, callback) => {
            if (!value.file) {
                callback(new Error('请上传头像'));
            } else {
                callback();
            }
        };
        return {
            columns: [
                {
                    title: 'ID',
                    // width: "10%",
                    key: 'id'
                },
                {
                    title: '帐号',
                    key: 'account'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '手机',
                    key: 'mobile'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'date_added'
                },
                {
                    title: '部门',
                    key: 'user_group_id',
                    // width: "10%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="交易中";

                        $.each(this.groupData,(small_index, small_el)=>{
                            if(params.row.user_group_id==small_el.id)tagText=small_el.name
                        })
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
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
                                        this.doWhat("delete",params.index)
                                    }
                                }
                            }, '删除');

                        let dobutton=[];
                        if(this.checkPower("edit")){
                            dobutton.push(editButton);
                        };
                        if(this.checkPower("delete")){
                            dobutton.push(deleteButton);
                        };
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            doType:"list",
            switching:false,
            tableData: [],
            groupData: [],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:0,
            currentData: {},
            defaultData:{
                account: "",
                name: "",
                salt:"",
                mobile: "",
                face: {
                    url:"",
                    file:"",
                    fileObjName:"用户头像",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                password:"",
                user_group_id:""
            },
            addDataValidate: {
                account: [
                    { required: true, message: '请输入帐号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                face: [
                    { required: true, validator: valideFace, trigger: 'blur' }
                ],
                user_group_id: [
                    { required: true, validator: valideUserGroupId, trigger: 'blur' }
                ]
            },
            editDataValidate: {
                account: [
                    { required: true, message: '请输入帐号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                user_group_id: [
                    { required: true, validator: valideUserGroupId, trigger: 'blur' }
                ]
            },
            editPasswordForm: {
                userid: '',
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            oldPassError: '',
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {}
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        },
        doName () {
            if (this.doType=="list") return "后台管理账户";
            if (this.doType=="edit") return "编辑账户";
            return "添加账户";
        },
        currentDataValidate () {
            if(this.doType=="add")return this.addDataValidate;
            return this.editDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return !!this.$store.state.Rights[Config.api.system.admin_assignments[dotype].MD5()];
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
            if(dotype=="list"){
                this.resetCurrentData();
                this.dataReady+=2;
                this.init();
                this.doType="list";
            };
            this.switching=false;
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
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            };
            this.page.pageNumber=1;
            this.dataReady+=1;
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
            this.getGroups();
            this.getList();
        },
        getList () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.user_name=this.searchData.keyword;
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_assignments.list,
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
                        let newListData=[];
                        data.data.list.forEach( item =>{
                            newListData.push(
                                {
                                    id: item.id,
                                    account: item.username,
                                    name: item.name,
                                    salt: item.salt,
                                    mobile: item.mobile,
                                    face: {
                                        url:item.image,
                                        file:"",
                                        fileObjName:"用户头像",
                                        uploadMenu:"选择图片",
                                        uploadType:"sync",
                                        type:"image",
                                        maxSize:2048
                                    },
                                    password:"",
                                    user_group_id:item.user_group_id,
                                    date_added:item.date_added,
                                    listIndex:newListData.length
                                }
                            );
                        });
                        this.tableData=newListData;
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
        getGroups () {
            let postData={
                ssid:Cookies.get('ssid')
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_department.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                this.dataReady--;
                if(!!data){
                    if(data.code==0){
                        this.groupData=data.data.list;
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
        //add && edit
        saveEdit () {
            if(!this.hasDataChange)return;
            this.$refs['currentData'].validate((valid) => {

                if (valid) {
                    this.switching = true;

                    var formData = new FormData();
                    formData.append("ssid", Cookies.get('ssid'));
                    formData.append("user_group_id", this.currentData.user_group_id);
                    formData.append("username", this.currentData.account);
                    formData.append("name", this.currentData.name);
                    formData.append("password", this.currentData.password);
                    formData.append("mobile", this.currentData.mobile);
                    formData.append("salt", this.currentData.salt||(parseInt(Math.random()*1000000)));

                    if(this.currentData.face.file){
                        formData.append("image", this.currentData.face.file);
                    };

                    let requestUrl=Config.apiRootPath+Config.api.system.admin_assignments.add;
                    
                    if(this.doType=="edit"){
                        formData.append("id", this.currentData.id);
                        requestUrl=Config.apiRootPath+Config.api.system.admin_assignments.edit;
                    };

                    let _this=this;
                    //拉取用户类型
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,   
                        cache: false,  
                        contentType: false,  
                        processData: false 
                    })
                    .done((data)=>{
                        this.switching=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.currentData.face.file="";
                                if(this.doType=="add")this.doWhat("list");
                                this.$Message.success("账户保存成功！");
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
        //edit password
        showEditPassword (id) {
            if(!id)return;
            this.editPasswordForm.userid=id;
            this.editPasswordModal = true;
        },
        cancelEditPass () {
            this.editPasswordForm.userid='';
            this.editPasswordForm.oldPass='';
            this.editPasswordForm.newPass='';
            this.editPasswordForm.rePass='';
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;

                    let postData={
                        ssid:Cookies.get('ssid'),
                        id:this.editPasswordForm.userid,
                        password:this.editPasswordForm.oldPass,
                        new_password:this.editPasswordForm.newPass,
                        ok_new_password:this.editPasswordForm.rePass
                    };

                    $.ajax({
                        url: Config.apiRootPath+Config.api.system.admin_assignments.modifyPassword,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.savePassLoading=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("修改密码成功！");
                                this.editPasswordForm.oldPass="";
                                this.editPasswordForm.newPass="";
                                this.editPasswordForm.rePass="";
                                this.editPasswordForm.userid="";
                                this.editPasswordModal = false;
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
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });

                }
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
                url: Config.apiRootPath+Config.api.system.admin_assignments.delete,
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
