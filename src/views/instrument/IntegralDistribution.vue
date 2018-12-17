


<style lang="less">

</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="gear-b"></Icon>
                积分分发工具
            </p>

                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width: 500px">
                    <FormItem label="预购宝ID" prop="name">
                        <Input v-model="formValidate.name" placeholder="请输入预购宝ID"></Input>
                    </FormItem>
                    <FormItem label="总积分" prop="number">
                        <Input v-model="formValidate.number" placeholder="请输入总积分"></Input>
                    </FormItem>

                    <FormItem label="期数" prop="periods">
                        <Select v-model="formValidate.periods" placeholder="请选择期数">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                            <Option value="6">6</Option>
                            <Option value="7">7</Option>
                            <Option value="8">8</Option>
                            <Option value="9">9</Option>
                            <Option value="10">10</Option>
                            <Option value="11">11</Option>
                            <Option value="12">12</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="类型" prop="type">
                        <Select v-model="formValidate.type" placeholder="请选择类型">
                            <Option value="9">活动</Option>
                            <Option value="99">其他</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                    </FormItem>
                </Form>

        </Card>

    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import Config from '../../config/config';

    export default {
        name: 'IntegralDistribution',
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入积分分发总数'));
                } else {
                    let reg = /^[1-9]\d*$/;
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                        // this.$refs.formCustom.validateField('passwdCheck');
                        callback();
                    }else{
                        callback(new Error('请输入正确的积分分发总数'));
                    }

                }
            };
            return {
                formValidate: {
                    name: '',
                    number: '',
                    type: '',
                    periods: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '预购宝ID不能为空', trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: '预购宝ID不能为空', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }


                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    periods: [
                        { required: true, message: '请选择期数', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // this.$Message.success('Success!');
                        let postData={
                            ssid:Cookies.get('ssid'),

                            acount:this.formValidate.name,
                            stage:this.formValidate.periods,
                            shoppingSum:this.formValidate.number,
                            type:this.formValidate.type
                        };

                        $.ajax({
                            url: Config.apiRootPath+Config.api.user.IntegralDistribution.IntegralDistribution,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                            .done((data)=>{
                                this.savePassLoading=false;
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.$Message.success("操作成功！");
                                        this.$refs[name].resetFields();
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

                    } else {
                        // this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    };
</script>
