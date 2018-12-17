<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息修改
            </p>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="用户帐号：" prop="account">
                        <div style="display:inline-block;width:300px;">
                            {{userForm.account}}
                        </div>
                    </FormItem>
                    <FormItem label="用户姓名：" prop="name">
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="用户手机：" prop="cellphone" >
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="userForm.cellphone" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="头像：" prop="userface">
                        <noUpFileInput :fileInfro="userForm.face"></noUpFileInput>
                    </FormItem>
                    <FormItem label="部门：">
                        <span>{{ userForm.department }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
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
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';

export default {
    name: 'own_space',
    components: {
        noUpFileInput
    },    
    data () {
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
        return {
            userForm: {
                account: "",
                name: '',
                salt:"",
                cellphone: '',
                face: {
                    url:"",
                    file:"",
                    fileObjName:"用户头像",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                user_group_id:"",
                department: '',
                group_id:""
            },
            origin_data:{},
            save_loading: false,
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            inforValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                cellphone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ]
            },
            editPasswordForm: {
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
            }
        };
    },
    computed: {
        hasDataChange () {
            return !(JSON.stringify(this.origin_data)==JSON.stringify(this.userForm));
        }
    },
    methods: {
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            if(!this.hasDataChange)return;
            this.$refs['userForm'].validate((valid) => {
                if (valid) {

                    var formData = new FormData();
                    formData.append("ssid", Cookies.get('ssid'));
                    formData.append("id", Cookies.get('user_id'));
                    formData.append("user_group_id", this.userForm.group_id);
                    formData.append("username", this.userForm.account);
                    formData.append("name", this.userForm.name);
                    formData.append("mobile", this.userForm.cellphone);
                    formData.append("salt", this.userForm.salt);

                    if(this.userForm.face.file){
                        formData.append("image", this.userForm.face.file);
                    };

                    this.save_loading=true;
                    let _this=this;
                    //拉取用户类型
                    $.ajax({
                        url: Config.apiRootPath+Config.api.own_space.edit,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,   
                        cache: false,  
                        contentType: false,  
                        processData: false 
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.userForm.face.file="";
                                this.init();
                                this.$Message.success("成功保存基本信息！");
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
                        this.save_loading=false;
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            });
        },
        cancelEditPass () {
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;

                    let postData={
                        ssid:Cookies.get('ssid'),
                        id:Cookies.get('user_id'),
                        password:this.editPasswordForm.oldPass,
                        new_password:this.editPasswordForm.newPass,
                        ok_new_password:this.editPasswordForm.rePass
                    };

                    $.ajax({
                        url: Config.apiRootPath+Config.api.own_space.modifyPassword,
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
        init () {
            
            let postData={
                    ssid:Cookies.get('ssid'),
                    id:Cookies.get('user_id')
                };
            $.ajax({
                url: Config.apiRootPath+Config.api.own_space.detail,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{

                if(!!data){
                    if(data.code==0){
                        this.userForm.account = data.data.username;
                        this.userForm.name = data.data.name;
                        this.userForm.salt = data.data.salt;
                        this.userForm.group_id = data.data.user_group_id;
                        this.userForm.cellphone = data.data.mobile;
                        this.userForm.face.url = data.data.image;
                        this.userForm.department = data.data.user_group_name;
                        this.$store.commit('setAvator', data.data.image);
                        this.origin_data=$.extend(true,{}, this.userForm);
                    }else{
                        return;
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"获取用户基本信息失败"
                    });
                }

            })
            .fail((xhr,status,error)=>{
                Config.showError({vm:this,data:data,
                    errorMsg:"获取用户基本信息失败"
                });
            });



        }
    },
    mounted () {
    },
    activated () {
        this.init();
    }
};
</script>
