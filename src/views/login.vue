<style lang="less">
    @import './login.less';
    .logincode{ position: relative;}
    .logincode-input .ivu-input{ width: 50%; }
    .logincode-img{ width: 120px; float: right; margin:2px 0 0; position:absolute; right: 0px; top: 0px; }
    .logincode-img img{border-radius: 3px}
     .login-con .ivu-input-group-prepend{
        width:46px!important;
    }
    .login-con .ivu-input{
        height:46px!important;
        height-line:46px!important;
    }
    
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false" style="background:rgba(255,255,255,0.3);padding: 20px;border-radius:15px;">
                
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="logincode" class="logincode">
                            <Input v-model="form.logincode" :maxlength="4" style="width: 340px; float:left" class="logincode-input" placeholder="请输入验证码">
                                <span slot="prepend">
                                    <Icon :size="14" type="ios-eye"></Icon>
                                </span>
                            </Input>
                            <Tooltip content="看不清？点击刷新" placement="top" class="logincode-img">
                                <img :src="loginCodeBaseUrl+form.random" @click="changeCodeImg" width="120" height="47" />
                            </Tooltip>
                            <div class="clearfix"></div>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit()" style="height:46px;border:none;background:#cb9d40" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip"><a href="javascript:;"  @click="register" >没有帐号？点击注册</a></p>
                </div>
            </Card>
        </div>
        <div class="copy-right">
            © 2018陕西振华网络科技有限责任公司 <br /> 技术支持：陕西振华网络科技有限责任公司     客服热线：000-000-0000
        </div>
    </div>
</template>

<script>

import Config from '../config/config';
import Util from '../libs/util';
import Cookies from 'js-cookie';
import md5 from '../libs/md5';

Cookies.remove('user');
Cookies.remove('hasGreet');
Cookies.remove('access');
Cookies.remove('user_power');
Cookies.remove('cloud_account');
Cookies.remove('cloud_status');
Cookies.remove('merchant_id');
Cookies.remove('user_id');
Cookies.remove('ssid');

export default {
    data () {
        return {
            loginCodeBaseUrl:Config.apiRootPath+Config.api.login.CodeImage+"&code=",
            form: {
                userName: '',
                password: '',
                logincode: '',
                state: true,
                random: (parseInt(Math.random() * 1000000))
            },
            rules: {
                userName: [
                    {
                        whitespace: true, //不能输入空白字符
                        required: true, // len  — 输入值不能为空
                        message: '账号不能为空',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { whitespace:true, required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                logincode: [
                    { required: true, max: 4 ,min: 4, message: '请正确输入验证码', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        handleSubmit: function (){
            Cookies.set('access', 1);
            this.$refs.loginForm.validate((valid) => {

                if (valid) {
                    let _this = this;
                    let postData = {
                        username: this.form.userName,
                        password: this.form.password,
                        code: this.form.logincode,
                        random: this.form.random
                    };
                    let sucessFun = function (data) {
                        if (!!data) {
                            if (data.code == 0 && data.data.ssid) {
                                let userPower = {};
                                for (let item in data.data.power) {
                                    // let dataPower=data.data.power[item]
                                    // console.log(dataPower);
                                    // dataPower=dataPower.substring(2)
                                    userPower[data.data.power[item].MD5()] = 1;
                                };
                                Cookies.set('user', data.data.username);
                                Cookies.set('user_id', data.data.id);
                                Cookies.set('user_group', data.data.user_group_id);
                                Cookies.set('user_group_name', data.data.user_group_name || '部门名称');
                                Cookies.set('ssid', data.data.ssid);
                                Cookies.set('user_power', JSON.stringify(userPower));
                                _this.$store.commit('setAvator', data.data.image);
                                _this.$store.commit('setPower');
                                _this.$router.push({
                                    name: 'home_index'
                                });

                            } else {
                                _this.$Modal.error({
                                    title: '登录失败',
                                    content: `<span style="font-size:14px;color:red">${data.message}</span><br />
                                              <p style="color:#999;padding-top:20px">错误代码：${data.code}</p>
                                             `
                                });
                                _this.changeCodeImg();

                            }
                        } else {
                            _this.$Modal.error({
                                title: '服务器错误',
                                content: ''
                            });

                        }
                    };
                    let errFun = function () {
                        _this.$Modal.error({
                            title: '登录失败',
                            content: '服务器请求失败'
                        });
                    };
                    $.ajax({
                        url: Config.apiRootPath + Config.api.login.request,
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                    })
                        .done(sucessFun)
                        .fail(errFun);
                    //.always(completeFun);
                }
            });
            this.form.state = true;
        },
        changeCodeImg () {
            this.form.random = (parseInt(Math.random() * 1000000));
        },
        register () {
            this.$router.push({
                name: 'register'
            });
        }
    }
};
</script>

<style>

</style>
