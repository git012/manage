<style lang="less">
    @import "../../styles/common.less";
    .inline-form-item{ display:inline-block; }
    .need-inline-div {margin-top: 30px;margin-bottom: 30px}
    .need-inline-div span{display:inline-block;line-height:32px; padding:0 6px; }
</style>

<template>
    <Form
        id="editForm"
        ref="currentData"
        :model="currentData" 
        :rules="currentDataValidate"
        @submit="saveEdit"
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
            <Button :disable="hasDataChange" type="primary" style="width: 130px;" :loading="save_loading" @click="saveEdit()">开始绑定</Button>
            <Button type="default" style="width: 130px; margin-left:33px" @click="cancelEdit" >返回列表</Button> 
        </div>
    </Form>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';


export default {
    name: 'give-card',
    data () {
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
        return {
            currentData:{},
            defaultData:{
                agent_id: 0,
                member_id : 0,
                share_start: "",
                share_end: "",
                enterprise_start: "",
                enterprise_end: ""
            },
            shareCard:[""],
            enterpriseCard:[""],
            doType:"add",
            FormSubmiting:false,
            save_loading: false,
            addDataValidate: {
            },
            editDataValidate: {
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
        saveEdit () {
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
                agent_id:this.param.agent.id,
                member_id:this.param.shareholder.member_id
            };
            postData.share=shareCards;
            postData.enterprise=enterpriseCards;


            let requestUrl=Config.apiRootPath+Config.api.agents.agents_list.giveChildCard;

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
