<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <Form 
        ref="currentData"
        :model="currentData" 
        :label-width="150" 
        label-position="right"
        :rules="currentDataValidate"
    >
        <FormItem label="代理商名称：">
            {{param.agent.agent_name}}
        </FormItem>
        <FormItem label="发起人人数：" prop="originator_num">
            <div style="width:100px;">
                <Input v-model="currentData.originator_num" ></Input>
            </div>
        </FormItem>
        <FormItem label="发起人分润比例：" prop="originator_ratio">
            <div style="width:127px;">
                <Input v-model="currentData.originator_ratio" ><span slot="append">%</span></Input>
            </div>
        </FormItem>
        <FormItem label="联合发起人人数：" prop="union_num">
            <div style="width:100px;">
                <Input v-model="currentData.union_num" ></Input>
            </div>
        </FormItem>
        <FormItem label="联合发起人分润比例：" prop="union_ratio">
            <div style="width:127px;">
                <Input v-model="currentData.union_ratio" ><span slot="append">%</span></Input>
            </div>
        </FormItem>
        <FormItem label="创始发起人人数：" prop="initiate_num">
            <div style="width:100px;">
                <Input v-model="currentData.initiate_num" ></Input>
            </div>
        </FormItem>
        <FormItem label="创始发起人分润比例：" prop="initiate_ratio">
            <div style="width:127px;">
                <Input v-model="currentData.initiate_ratio" ><span slot="append">%</span></Input>
            </div>
        </FormItem>
        <FormItem label="普通合伙人人数：" prop="ordinary_num">
            <div style="width:100px;">
                <Input v-model="currentData.ordinary_num" ></Input>
            </div>
        </FormItem>
        <FormItem label="普通合伙人分润比例：" prop="ordinary_ratio">
            <div style="width:127px;">
                <Input v-model="currentData.ordinary_ratio" ><span slot="append">%</span></Input>
            </div>
        </FormItem>
        <FormItem label="" >
            <input type="hidden" :value="sum_ratio" />
            <Button type="primary" style="width: 100px;margin-right:10px" :disabled="dataReady!=0" @click="saveEdit">保存</Button>
            <Button type="default" style="width: 100px;" @click="doWhat('list')">返回列表</Button>
        </FormItem>
    </Form> 
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';

export default {
    name: 'share-scale',
    props: ['param',"publicData"],
    data () {
        const validateNumber = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error(rule.message));
            }
        };
        const valideProvinceId = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择地区'));
            }
        };
        return {
            currentData:{},
            editData:{},
            defaultData:{
                "id": "",
                "agent_id": "",
                "originator_num": 0,
                "originator_ratio": 0,
                "union_num": 0,
                "union_ratio": 0,
                "initiate_num": 0,
                "initiate_ratio": 0,
                "ordinary_num": 0,
                "ordinary_ratio": 0
            },
            doType:"add",
            FormSubmiting:false,
            save_loading: false,
            dataReady:1,
            addDataValidate: {
                originator_num: [
                    {required: true, validator: validateNumber , message: '请填写发起人人数' , trigger: 'blur'}
                ],
                originator_ratio: [
                    {required: true, validator: validateNumber , message: '请填写发起人分润比例', trigger: 'blur' }
                ],
                union_num: [
                    {required: true, validator: validateNumber , message: '请填写联合发起人人数', trigger: 'blur' }
                ],
                union_ratio: [
                    {required: true, validator: validateNumber , message: '请填写联合发起人分润比例', trigger: 'blur' }
                ],
                initiate_num: [
                    {required: true, validator: validateNumber , message: '请填写创始发起人人数', trigger: 'blur' }
                ],
                initiate_ratio: [
                    {required: true, validator: validateNumber , message: '请填写创始发起人分润比例', trigger: 'blur' }
                ],
                ordinary_num: [
                    {required: true, validator: validateNumber , message: '请填写普通合伙人人数', trigger: 'blur' }
                ],
                ordinary_ratio: [
                    {required: true, validator: validateNumber , message: '请填写普通合伙人分润比例', trigger: 'blur' }
                ]
            },
            editDataValidate: {
            }
        }
    },
    computed : {
        currentDataValidate () {
            if(this.currentData&&this.currentData.id)return this.editDataValidate;
            return this.addDataValidate;
        },
        hasDataChange () {
            if(this.business_licence_image.file)return true;
            if(this.juridical_person_card_image.file)return true;
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.param));
        },
        sum_ratio () {
            let sum_ratio=this.currentData.originator_num*this.currentData.originator_ratio + this.currentData.union_ratio*this.currentData.union_num + this.currentData.initiate_ratio*this.currentData.initiate_num + this.currentData.ordinary_ratio*this.currentData.ordinary_num;
            return sum_ratio
        }
    },
    methods: {
        resetData () {
            this.defaultData.agent_id=this.param.agent.id;
            this.currentData=$.extend( true, {}, this.defaultData );
            this.dataReady=1;
        },
        doWhat (doType) {
            if(doType=="list"){
                this.$emit("doWhat","list",this.param);
            }
        },
        //add && edit
        saveEdit () {
            
            this.$refs['currentData'].validate((valid) => {
                if (valid) {
                    if(this.sum_ratio!=100){
                        this.$Modal.error({
                            title: "错误提示",
                            content: "所有分红比例之和应该等于100%"
                        });
                        return;
                    };
                    this.switching = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        agent_id            : this.currentData.agent_id,
                        originator_num      : this.currentData.originator_num,
                        originator_ratio    : this.currentData.originator_ratio,
                        union_num           : this.currentData.union_num,
                        union_ratio         : this.currentData.union_ratio,
                        initiate_num        : this.currentData.initiate_num,
                        initiate_ratio      : this.currentData.initiate_ratio,
                        ordinary_num        : this.currentData.ordinary_num,
                        ordinary_ratio      : this.currentData.ordinary_ratio
                    };

                    let requestUrl=Config.apiRootPath+Config.api.agents.agents_list.shareScaleAdd;
                    
                    if(this.doType=="edit"){
                        requestUrl=Config.apiRootPath+Config.api.agents.agents_list.shareScaleEdit;
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
                                //this.$emit("doWhat","list");
                                this.$Message.success("保存成功！");
                                this.doType=="edit";
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
        getData () {
            let postData={
                ssid:Cookies.get('ssid'),
                id:this.param.agent.id
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.agents.agents_list.shareScale,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.dataReady--;              
                // getList
                if(!!data){
                    if(data.code==0){
                        this.doType="edit";
                        //format list data
                        this.currentData.agent_id           =   data.data.agent_id||this.param.agent.id;
                        this.currentData.originator_num     =   data.data.originator_num||0;
                        this.currentData.originator_ratio   =   data.data.originator_ratio||0;
                        this.currentData.union_num          =   data.data.union_num||0;
                        this.currentData.union_ratio        =   data.data.union_ratio||0;
                        this.currentData.initiate_num       =   data.data.initiate_num||0;
                        this.currentData.initiate_ratio     =   data.data.initiate_ratio||0;
                        this.currentData.ordinary_num       =   data.data.ordinary_num||0;
                        this.currentData.ordinary_ratio     =   data.data.ordinary_ratio||0;
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
            
        }
    },
    beforeMount () {
    
    },
    mounted () {
        
    },
    created () {
        this.resetData();
        if(this.param.agent&&this.param.agent.id){
            this.dataReady=1;
            this.getData();
        };
    },
    deactivated () {
    },
    updated () {
     },
    destroyed () { 
    }
};
</script>
