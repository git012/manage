<style lang="less">
    @import './agents.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="compose"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small" 
                    v-if="checkPower('list')&&doType!='list'" 
                    @click="doWhat('list')" >返回代理商列表
                </Button>
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
               
                  <component @doWhat="doWhat" :param="paramData" :publicData="publicData" :is="currentView">
                    <!-- 非活动组件将被缓存！ -->
                  </component>
               
            </div>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
import agentsList from './agents-list.vue';
import editAgents from './edit-agent.vue';
import editChild from './edit-child.vue';
import manageChild from './childs.vue';
import shareScale from './shareScale.vue';
import giveCard from './give-card.vue';
import cardList from './card-list.vue';

export default {
    name: 'agents_list',
    components: {   
        agentsList  : agentsList,
        editAgents  : editAgents,  
        editChild   : editChild,
        manageChild : manageChild,
        shareScale  : shareScale,
        giveCard    : giveCard,
        cardList    : cardList
    },
    data () {
        return {
            doType:"list",
            switching:false,
            publicData:{
                agentsTypeData: ["未知","全球总代理","省代理","市代理","区县代理","其他"],
                shareholderType:["未知","发起人 10%","联合发起人 6%","创始发起人 3%","普通合伙人 1.5%"]
            },
            dataReady:0,
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[]
            },
            paramData:{
                agent:{},//代理商
                shareholder:{},//股东
                shareScale:{}//分红比例
            },
            currentView:"agentsList"
        };
    },
    computed : {
        doName () {

            if (this.doType=="list") return "代理商基本信息管理";
            if (this.doType=="edit") return "编辑代理商";
            if (this.doType=="add") return "添加代理商";
            if (this.doType=="shareScale") return "分红比例管理  - " + this.paramData.agent.agent_name;
            if (this.doType=="manageChild") return "股东管理  - " + this.paramData.agent.agent_name;
            if (this.doType=="addChild") return "添加股东  - 股东管理  - " + this.paramData.agent.agent_name;
            if (this.doType=="editChild") return "编辑股东  -  股东管理 - " + this.paramData.agent.agent_name;
            if (this.doType=="giveChildCard") return this.paramData.shareholder.member_name +" - "+ "绑定升级卡  -  股东管理 - " + this.paramData.agent.agent_name ;
            return "代理商详情";
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return true;
            return !!this.$store.state.Rights[Config.api.agents.agents_list[dotype]];
        },
        doWhat (dotype,paramData) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            };
            if(paramData){
                this.paramData=paramData;
            }
            this.switching=true;
            if(dotype=="add"){
                // this.paramData.agent=paramData;
                this.currentView="editAgents";
                this.doType="add";
            };
            if(dotype=="edit"){
                // this.paramData.agent=paramData;
                this.currentView="editAgents";
                this.doType="edit";
            };
            if(dotype=="shareScale"){
                // this.paramData.agent=paramData;
                this.currentView="shareScale";
                this.doType="shareScale";
            };
            if(dotype=="manageChild"){
                // this.paramData.agent=paramData;
                this.currentView="manageChild";
                this.doType="manageChild";
            };
            if(dotype=="addChild"){
                // this.paramData.shareholder=paramData;
                this.currentView="editChild";
                this.doType="addChild";
            };
            if(dotype=="editChild"){
                // this.paramData.shareholder=paramData;
                this.currentView="editChild";
                this.doType="editChild";
            };
            if(dotype=="giveChildCard"){
                // this.paramData.shareholder=paramData;
                this.currentView="giveCard";
                this.doType="giveChildCard";
            };
            if(dotype=="cardList"){
                // this.paramData.shareholder=paramData;
                this.currentView="cardList";
                this.doType="cardList";
            };
            if(dotype=="list"){
                this.currentView="agentsList";
                this.doType="list";
            };
            this.switching=false;
        },
        //comm
        resetCurrentData () {
            this.paramData = {};
        }
    },
    mounted () {

    },
    activated (){
        this.doWhat("list",this.paramData);   
    }
};
</script>