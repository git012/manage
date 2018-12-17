<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <Form
        id="editForm"
        ref="currentData"
        :model="currentData" 
        :label-width="200"
        label-position="right"
        :rules="currentDataValidate"
        @submit="saveEdit"
    >
        <FormItem label="股东预购宝账号：" prop="member_name">
            <div style="width:200px;">
                <Input v-model="currentData.member_name" ></Input>
            </div>
        </FormItem>
        <FormItem label="推荐人账号：" prop="share_member">
            <div style="width:200px;">
                <Input v-model="currentData.share_member" ></Input>
            </div>
        </FormItem>
        <FormItem label="股东类型：" prop="share_member_type">
            <div style="width:200px;">
                <Select v-model="currentData.share_member_type">
                    <Option v-for="item,key in publicData.shareholderType" v-if="key>0" :value="key" :key="key">{{ item }}</Option>
                </Select>
            </div>
        </FormItem><!--10 6 3 1.5-->
        <FormItem label="代理股权金额：" prop="agent_stock_amount">
            <div style="width:200px;">
                <Input v-model="currentData.agent_stock_amount" ></Input>
            </div>
        </FormItem>
        
        <div>
            <Button type="text" style="width: 100px; margin-left:100px" @click="cancelEdit" >返回列表</Button>
            <Button html-type="submit" :disable="hasDataChange" type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
        </div>
    </Form>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';


export default {
    name: 'edit-child',
    data () {
        const valideShareMemberType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择股东类型1'));
            }
        };
        return {
            currentData:{},
            defaultData:{
                agent_id: 0,
                member_name: "",
                share_member_type: "",
                agent_stock_amount: "",
                share_member: ""
            },
            doType:"add",
            FormSubmiting:false,
            save_loading: false,
            addDataValidate: {
                member_name: [
                    { required: true, message: '请填写预购宝账号', trigger: 'blur' }
                ],
                share_member: [
                    { required: true,  message: '请填写推荐人账号', trigger: 'blur' }
                ],
                share_member_type: [
                    { required: true, validator: valideShareMemberType ,  message: '请选择股东类型', trigger: 'blur' }
                ],
                agent_stock_amount: [
                    { required: true, message: '请填写代理股权金额', trigger: 'blur' }
                ]
            },
            editDataValidate: {
                member_name: [
                    { required: true, message: '请填写预购宝账号', trigger: 'blur' }
                ],
                share_member: [
                    { required: true, message: '请填写推荐人账号', trigger: 'blur' }
                ],
                share_member_type: [
                    { required: true, validator: valideShareMemberType , message: '请选择股东类型3', trigger: 'blur' }
                ],
                agent_stock_amount: [
                    { required: true, message: '请填写代理股权金额', trigger: 'blur' }
                ]
            },
            paramData:{}
        }
    },
    props : [
        "param",
        "publicData"
    ],
    computed : {
        dowhat (){
            return this.editType
        },
        editor() {
            return this.$refs.myTextEditor.quill;
        },
        beEditData () {
            return this.editData
        },
        contentBody () {
            return this.currentData.content
        },
        currentDataValidate () {
            if(this.doType=="add")return this.addDataValidate;
            return this.editDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.editData));
        }
    },
    methods: {
        cancelEdit () {
            this.$emit('doWhat','manageChild',this.paramData)
        },
        //add && edit
        saveEdit () {

            this.$refs['currentData'].validate((valid) => {

                if (valid) {
                    this.switching = true;

                    let postData={
                        ssid:Cookies.get('ssid'),
                        agent_id:this.param.agent.id,
                        member_name:this.currentData.member_name,
                        share_member:this.currentData.share_member,
                        type:this.currentData.share_member_type,
                        agent_stock_amount:this.currentData.agent_stock_amount
                    };
                    let requestUrl=Config.apiRootPath+Config.api.agents.agents_list.addChild;
                    
                    if(this.dowhat=="edit"){
                        postData.id=this.currentData.id;
                        requestUrl=Config.apiRootPath+Config.api.agents.agents_list.editChild;
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
                                if(this.doType=="add")this.$emit("doWhat","manageChild",this.param);
                                this.$Message.success("保存成功！");
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
        init () {          
        }
    },
    beforeMount () {
    
    },
    mounted () { 
    },
    created () {
        this.paramData=this.param;
        this.currentData=this.paramData.shareholder;
    },
    deactivated () {
      
    },
    destroyed () {
       // tinyMCE.remove();
 
    },
    activated (){
    },
    watch : {
    }
};
</script>
