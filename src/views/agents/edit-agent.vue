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
        <Spin size="large" fix v-if="save_loading"></Spin>
        <FormItem label="代理商名称：" prop="agent_name">
            {{currentData.agent_name}}
        </FormItem>
        <FormItem v-if="currentData.id" label="代理商类型：" prop="type">
            {{publicData.agentsTypeData[currentData.type]}}
        </FormItem>
        <FormItem label="代理商区域：" v-if="areaData.province.length" prop="province_id">
            {{currentData.province_name}}{{currentData.city_name}}{{currentData.district_name}}
        </FormItem>
        <FormItem label="代理公司名称：" prop="enterprise_name">
            <div style="display:inline-block;width:200px;">
                <Input v-model="currentData.enterprise_name" ></Input>
            </div>
        </FormItem>
        <FormItem label="代理商地址：" prop="address">
            <div style="display:inline-block;width:400px;">
                <Input v-model="currentData.address" ></Input>
            </div>
        </FormItem>
        <FormItem label="代理商电话：" prop="tel">
            <div style="display:inline-block;width:150px;">
                <Input v-model="currentData.tel" ></Input>
            </div>
        </FormItem>
        <FormItem label="营业执照照片：" prop="business_licence_image">
            <noUpFileInput :fileInfro="business_licence_image"></noUpFileInput>
        </FormItem>
        <FormItem label="法人：" prop="juridical_person">
            <div style="display:inline-block;width:150px;">
                <Input v-model="currentData.juridical_person" ></Input>
            </div>
        </FormItem>
        <FormItem label="法人身份证号码：" prop="juridical_person_card">
            <div style="display:inline-block;width:200px;">
                <Input v-model="currentData.juridical_person_card" ></Input>
            </div>
        </FormItem>
        <FormItem label="法人身份证照片：" prop="juridical_person_card_image">
            <noUpFileInput :fileInfro="juridical_person_card_image"></noUpFileInput>
        </FormItem>
        <FormItem label="" >
            <Button type="primary" style="width: 100px;margin-right:10px" @click="saveEdit">保存</Button>
            <Button type="default" style="width: 100px;" @click="doWhat('back-agent-list')">返回列表</Button>
        </FormItem>
    </Form> 
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';

export default {
    name: 'edit-agents',
    components: {
        noUpFileInput
    },
    props: ['param',"publicData"],
    data () {
        const valideType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择代理商类型'));
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
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[]
            },
            business_licence_image: {
                url:"",
                file:"",
                fileObjName:"营业执照照片",
                uploadMenu:"选择图片",
                uploadType:"sync",
                type:"image",
                maxSize:2048
            },
            juridical_person_card_image: {
                url:"",
                file:"",
                fileObjName:"法人身份证照片",
                uploadMenu:"选择图片",
                uploadType:"sync",
                type:"image",
                maxSize:2048
            },
            currentData:{},
            editData:{},
            defaultData:{
                "id": "",
                "type": "",
                "province_id": "",
                "city_id": "",
                "district_id": "",
                "agent_name": "",
                "enterprise_name": "",
                "address": "",
                "tel": "",
                "business_licence_image": "",
                "share_member_ratio": "0.00",
                "share_company_ratio": "0.00",
                "share_bd_ratio": "0.00",
                "parent_id": "",
                "date_added": "",
                "is_lock": "",
                "agent_score": "0.0000",
                "juridical_person": "",
                "juridical_person_card": "",
                "juridical_person_card_image": ""
            },
            doType:"add",
            FormSubmiting:false,
            save_loading: false,
            addDataValidate: {
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
        }
    },
    methods: {
        resetData () {
            this.currentData=$.extend( true, {}, this.defaultData );
            this.areaData.areaDataReady=3;
            this.areaData.citys=[];
            this.areaData.district=[];
            this.business_licence_image.url="";
            this.business_licence_image.file="";
            this.juridical_person_card_image.url="";
            this.juridical_person_card_image.file="";
        },
        doWhat (doType) {
            if(doType=="back-agent-list"){
                this.$emit("doWhat","list",this.param);
            }
        },
        //add && edit
        saveEdit () {
             this.$refs['currentData'].validate((valid) => {
                if (valid) {
                    this.save_loading = true;
                    var formData = new FormData();

                    formData.append("ssid",                 Cookies.get('ssid'));
                    formData.append("enterprise_name",      this.currentData.enterprise_name);
                    formData.append("address",              this.currentData.address);
                    formData.append("tel",                  this.currentData.tel);
                    formData.append("juridical_person",     this.currentData.juridical_person);
                    formData.append("juridical_person_card",this.currentData.juridical_person_card);

                    if(this.business_licence_image.file){
                        formData.append("business_licence_image",      this.business_licence_image.file);
                    };
                    if(this.juridical_person_card_image.file){
                        formData.append("juridical_person_card_image",      this.juridical_person_card_image.file);
                    };

                    let requestUrl=Config.apiRootPath+Config.api.agents.agents_list.add;
                    
                    if(this.currentData.id){
                        formData.append("id", this.currentData.id);
                        requestUrl=Config.apiRootPath+Config.api.agents.agents_list.edit;
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
                        this.save_loading=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                //this.$emit("doWhat","list");
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
                        this.save_loading=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            })
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
                this.currentData.city_id="";
                this.currentData.district_id="";
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
                this.currentData.district_id="";
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
        }
    },
    beforeMount () {
    
    },
    mounted () {
        
    },
    created () {
        this.resetData();
        //this.setProvince();
console.log(this.param);
        if(this.param.agent&&this.param.agent.id){
            this.currentData=this.param.agent;
            this.business_licence_image.url=this.currentData.business_licence_image;
            this.juridical_person_card_image.url=this.currentData.juridical_person_card_image;
            // if(this.currentData.city_id==0)this.currentData.city_id="";
            // if(this.currentData.district_id==0)this.currentData.district_id="";
            // this.setCity(this.currentData.province_id,true);
            // this.setDistrict(this.currentData.city_id,true); 
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
